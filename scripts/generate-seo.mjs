import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = path.join(root, "client", "src", "content");
const publicDirectory = path.join(root, "client", "public");
const siteUrl = "https://cheverny.andrologiciels.com";

const fixedPages = [
  ["/", "home.json"],
  ["/maison", "maison.json"],
  ["/chateaux", "chateaux.json"],
  ["/autour-de-nous", "around.json"],
  ["/balades", "outdoors.json"],
  ["/commerces-utiles", "useful.json"],
  ["/idees-de-sejour", "stays.json"],
  ["/loisirs", "leisure.json"],
];

function normalizeSeo(content, pathname) {
  const fallbackTitle = content.hero?.title ?? content.title ?? "La Maison Vigneronne";
  const fallbackDescription = content.hero?.description ?? content.description ?? "";
  const fallbackImage = content.hero?.image ?? content.hero?.mainImage ?? content.heroImage;

  return {
    path: pathname,
    title: content.seo?.title || fallbackTitle,
    description: content.seo?.description || fallbackDescription,
    image: content.seo?.shareImage || fallbackImage || "",
    noIndex: Boolean(content.seo?.noIndex),
  };
}

const pages = [];

for (const [pathname, filename] of fixedPages) {
  const content = JSON.parse(await readFile(path.join(contentDirectory, filename), "utf8"));
  pages.push(normalizeSeo(content, pathname));
}

const customPagesDirectory = path.join(contentDirectory, "pages");
for (const filename of await readdir(customPagesDirectory)) {
  if (!filename.endsWith(".json")) continue;
  const content = JSON.parse(await readFile(path.join(customPagesDirectory, filename), "utf8"));
  if (!content.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug)) continue;
  pages.push(normalizeSeo(content, `/${content.slug}`));
}

pages.sort((a, b) => a.path.localeCompare(b.path, "fr"));

const sitemapEntries = pages
  .filter((page) => !page.noIndex)
  .map((page) => `  <url>\n    <loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc>\n  </url>`)
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${siteUrl}/sitemap.xml
`;

await mkdir(publicDirectory, { recursive: true });
await Promise.all([
  writeFile(path.join(publicDirectory, "seo-manifest.json"), `${JSON.stringify({ siteUrl, pages }, null, 2)}\n`, "utf8"),
  writeFile(path.join(publicDirectory, "sitemap.xml"), sitemap, "utf8"),
  writeFile(path.join(publicDirectory, "robots.txt"), robots, "utf8"),
]);

console.log(`SEO: ${pages.length} page(s) ajoutée(s) au manifeste.`);
