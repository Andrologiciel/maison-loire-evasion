import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { z } from "zod";
import {
  LANGUAGES,
  PAGE_SLUGS,
  SITE_URL,
  getBookingLinks,
  getPage,
  getSiteOverview,
  listPages,
  searchSite,
} from "./mcp-content";

const languageSchema = z.enum(LANGUAGES).default("fr");
const pageSlugSchema = z.enum(PAGE_SLUGS);
const readOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

function result(data: Record<string, unknown> | unknown[]) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

export function createMaisonMcpServer() {
  const server = new McpServer(
    { name: "la-maison-vigneronne", version: "1.0.0" },
    { instructions: "Public, bilingual and read-only information about La Maison Vigneronne in Cour-Cheverny." },
  );

  server.registerTool(
    "get_site_overview",
    {
      title: "Get site overview",
      description: "Get a bilingual overview of La Maison Vigneronne and its available pages.",
      inputSchema: { language: languageSchema },
      annotations: readOnlyAnnotations,
    },
    ({ language }) => result(getSiteOverview(language)),
  );

  server.registerTool(
    "list_pages",
    {
      title: "List website pages",
      description: "List the public pages, titles, descriptions and URLs in French or English.",
      inputSchema: { language: languageSchema },
      annotations: readOnlyAnnotations,
    },
    ({ language }) => result(listPages(language)),
  );

  server.registerTool(
    "get_page",
    {
      title: "Read a website page",
      description: "Read the structured public content of one page in French or English.",
      inputSchema: { language: languageSchema, slug: pageSlugSchema },
      annotations: readOnlyAnnotations,
    },
    ({ language, slug }) => result(getPage(language, slug)),
  );

  server.registerTool(
    "search_site",
    {
      title: "Search the website",
      description: "Search the website content and return the most relevant public pages.",
      inputSchema: {
        language: languageSchema,
        query: z.string().trim().min(2).max(120),
        limit: z.number().int().min(1).max(10).default(5),
      },
      annotations: readOnlyAnnotations,
    },
    ({ language, query, limit }) => result(searchSite(language, query, limit)),
  );

  server.registerTool(
    "get_booking_links",
    {
      title: "Get booking links",
      description: "Return the official Airbnb and Booking.com reservation links.",
      annotations: { ...readOnlyAnnotations, openWorldHint: true },
    },
    () => result(getBookingLinks()),
  );

  for (const language of LANGUAGES) {
    const overviewUri = `site://la-maison-vigneronne/${language}/overview`;
    server.registerResource(
      `site-overview-${language}`,
      overviewUri,
      { title: `Site overview (${language.toUpperCase()})`, mimeType: "application/json" },
      async (uri) => ({
        contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(getSiteOverview(language), null, 2) }],
      }),
    );

    for (const slug of PAGE_SLUGS) {
      const resourceUri = `site://la-maison-vigneronne/${language}/pages/${slug}`;
      server.registerResource(
        `page-${language}-${slug}`,
        resourceUri,
        { title: `${getPage(language, slug).title} (${language.toUpperCase()})`, mimeType: "application/json" },
        async (uri) => ({
          contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(getPage(language, slug), null, 2) }],
        }),
      );
    }
  }

  return server;
}

export const MCP_ENDPOINT = `${SITE_URL}/mcp`;
export const mcpHttpHandler = createMcpHandler(() => createMaisonMcpServer(), {
  legacy: "stateless",
  responseMode: "auto",
  maxRequestBodySize: 64 * 1024,
  maxSubscriptions: 32,
  onerror: (error) => console.error("MCP error", error),
});
export const mcpNodeHandler = toNodeHandler(mcpHttpHandler);

