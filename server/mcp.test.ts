import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, test } from "node:test";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { getBookingLinks, getPage, listPages, searchSite } from "./mcp-content";
import { mcpHttpHandler, mcpNodeHandler } from "./mcp";

test("le catalogue bilingue expose toutes les pages principales", () => {
  assert.equal(listPages("fr").length, 8);
  assert.equal(listPages("en").length, 8);
  assert.equal(getPage("fr", "home").url, "https://cheverny.andrologiciels.com/");
  assert.equal(getPage("en", "maison").url, "https://cheverny.andrologiciels.com/en/maison");
});

test("la recherche renvoie des résultats pertinents et les liens de réservation", () => {
  const results = searchSite("fr", "Chambord château", 3);
  assert.ok(results.length > 0);
  assert.ok(results.some((result) => result.slug === "chateaux"));
  assert.match(getBookingLinks().airbnb, /^https:\/\/www\.airbnb\.fr\//);
  assert.match(getBookingLinks().booking, /^https:\/\/www\.booking\.com\//);
});

test("un client MCP se connecte, liste les outils et lit une ressource", async () => {
  const httpServer = createServer((request, response) => {
    void mcpNodeHandler(request, response);
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(0, "127.0.0.1", resolve);
  });

  const address = httpServer.address();
  assert.ok(address && typeof address === "object");

  const client = new Client({ name: "maison-mcp-tests", version: "1.0.0" });
  const transport = new StreamableHTTPClientTransport(
    new URL(`http://127.0.0.1:${address.port}/mcp`),
  );

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    assert.deepEqual(
      tools.tools.map((tool) => tool.name).sort(),
      ["get_booking_links", "get_page", "get_site_overview", "list_pages", "search_site"],
    );

    const pageResult = await client.callTool({
      name: "get_page",
      arguments: { language: "en", slug: "home" },
    });
    assert.equal(pageResult.isError, undefined);
    assert.match(JSON.stringify(pageResult.structuredContent), /Cour-Cheverny/);

    const resources = await client.listResources();
    assert.equal(resources.resources.length, 18);
    const resource = await client.readResource({
      uri: "site://la-maison-vigneronne/fr/pages/chateaux",
    });
    assert.match(resource.contents[0]?.text ?? "", /Cheverny/);
  } finally {
    await client.close();
    await new Promise<void>((resolve, reject) => {
      httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

after(async () => {
  await mcpHttpHandler.close();
});

