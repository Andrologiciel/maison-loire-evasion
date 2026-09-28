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

function englishPath(pathname) {
  return pathname === "/" ? "/en" : `/en${pathname}`;
}

function normalizeSeo(content, pathname, language, alternatePath) {
  const fallbackTitle = content.hero?.title ?? content.title ?? "La Maison Vigneronne";
  const fallbackDescription = content.hero?.description ?? content.description ?? "";
  const fallbackImage = content.hero?.image ?? content.hero?.mainImage ?? content.heroImage;

  return {
    path: pathname,
    language,
    alternatePath,
    title: content.seo?.title || fallbackTitle,
    description: content.seo?.description || fallbackDescription,
    image: content.seo?.shareImage || fallbackImage || "",
    noIndex: Boolean(content.seo?.noIndex),
  };
}

const pages = [];

for (const [pathname, filename] of fixedPages) {
  const content = JSON.parse(await readFile(path.join(contentDirectory, filename), "utf8"));
  const englishContent = JSON.parse(await readFile(path.join(contentDirectory, filename.replace(".json", ".en.json")), "utf8"));
  pages.push(normalizeSeo(content, pathname, "fr", englishPath(pathname)));
  pages.push(normalizeSeo(englishContent, englishPath(pathname), "en", pathname));
}

const customPagesDirectory = path.join(contentDirectory, "pages");
const customPagesEnglishDirectory = path.join(contentDirectory, "pages-en");
const frenchCustomPages = new Map();
const englishCustomPages = new Map();

for (const filename of await readdir(customPagesDirectory)) {
  if (!filename.endsWith(".json")) continue;
  const content = JSON.parse(await readFile(path.join(customPagesDirectory, filename), "utf8"));
  if (!content.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug)) continue;
  frenchCustomPages.set(content.slug, content);
}

for (const filename of await readdir(customPagesEnglishDirectory)) {
  if (!filename.endsWith(".json")) continue;
  const content = JSON.parse(await readFile(path.join(customPagesEnglishDirectory, filename), "utf8"));
  if (!content.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(content.slug)) continue;
  englishCustomPages.set(content.slug, content);
}

for (const [slug, content] of frenchCustomPages) {
  const hasEnglishVersion = englishCustomPages.has(slug);
  pages.push(normalizeSeo(content, `/${slug}`, "fr", hasEnglishVersion ? `/en/${slug}` : undefined));
}

for (const [slug, content] of englishCustomPages) {
  const hasFrenchVersion = frenchCustomPages.has(slug);
  pages.push(normalizeSeo(content, `/en/${slug}`, "en", hasFrenchVersion ? `/${slug}` : undefined));
}

pages.sort((a, b) => a.path.localeCompare(b.path, "fr"));

const sitemapEntries = pages
  .filter((page) => !page.noIndex)
  .map((page) => {
    const alternate = page.alternatePath
      ? `\n    <xhtml:link rel="alternate" hreflang="${page.language === "fr" ? "en" : "fr"}" href="${siteUrl}${page.alternatePath}" />`
      : "";
    return `  <url>\n    <loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc>\n    <xhtml:link rel="alternate" hreflang="${page.language}" href="${siteUrl}${page.path === "/" ? "/" : page.path}" />${alternate}\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
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
