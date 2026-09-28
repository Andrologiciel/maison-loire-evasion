import express from "express";
import { createServer } from "http";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const staticPath = path.resolve(__dirname, "public");
const appShell = readFileSync(path.join(staticPath, "index.html"), "utf8");

type SeoPage = {
  path: string;
  language: "fr" | "en";
  alternatePath?: string;
  title: string;
  description: string;
  image: string;
  noIndex: boolean;
};

type SeoManifest = {
  siteUrl: string;
  pages: SeoPage[];
};

const seoManifest = JSON.parse(
  readFileSync(path.join(staticPath, "seo-manifest.json"), "utf8"),
) as SeoManifest;
const seoPages = new Map(seoManifest.pages.map((page) => [page.path, page]));

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replaceHeadTag(html: string, pattern: RegExp, tag: string) {
  return pattern.test(html)
    ? html.replace(pattern, tag)
    : html.replace("</head>", `    ${tag}\n  </head>`);
}

function renderAppShell(page: SeoPage | undefined, pathname: string) {
  const notFound = !page;
  const language = page?.language ?? (pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr");
  const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const canonical = `${seoManifest.siteUrl}${canonicalPath}`;
  const title = page?.title || (language === "en" ? "Page not found | La Maison Vigneronne" : "Page introuvable | La Maison Vigneronne");
  const description = page?.description || (language === "en" ? "This page does not exist or has been moved." : "Cette page n’existe pas ou a été déplacée.");
  const robots = notFound || page?.noIndex ? "noindex, nofollow" : "index, follow";
  const image = page?.image
    ? page.image.startsWith("http")
      ? page.image
      : `${seoManifest.siteUrl}${page.image}`
    : "";

  let html = appShell
    .replace(/<html\s+lang="[^"]+">/i, `<html lang="${language}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceHeadTag(html, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceHeadTag(html, /<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="${robots}" />`);
  html = replaceHeadTag(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = replaceHeadTag(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceHeadTag(html, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceHeadTag(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  html = replaceHeadTag(html, /<meta\s+property="og:locale"[^>]*>/i, `<meta property="og:locale" content="${language === "en" ? "en_GB" : "fr_FR"}" />`);
  html = replaceHeadTag(html, /<meta\s+name="twitter:card"[^>]*>/i, `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`);

  const basePath = language === "en" ? (pathname === "/en" ? "/" : pathname.slice(3)) : pathname;
  const frenchPath = language === "fr" ? pathname : page?.alternatePath ?? basePath;
  const englishPath = language === "en" ? pathname : page?.alternatePath ?? (basePath === "/" ? "/en" : `/en${basePath}`);
  html = replaceHeadTag(html, /<link\s+rel="alternate"\s+hreflang="fr"[^>]*>/i, `<link rel="alternate" hreflang="fr" href="${escapeHtml(`${seoManifest.siteUrl}${frenchPath}`)}" />`);
  html = replaceHeadTag(html, /<link\s+rel="alternate"\s+hreflang="en"[^>]*>/i, `<link rel="alternate" hreflang="en" href="${escapeHtml(`${seoManifest.siteUrl}${englishPath}`)}" />`);
  html = replaceHeadTag(html, /<link\s+rel="alternate"\s+hreflang="x-default"[^>]*>/i, `<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${seoManifest.siteUrl}${frenchPath}`)}" />`);

  if (image) {
    html = replaceHeadTag(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`);
    html = replaceHeadTag(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />`);
  } else {
    html = html
      .replace(/\s*<meta\s+property="og:image"[^>]*>/i, "")
      .replace(/\s*<meta\s+name="twitter:image"[^>]*>/i, "");
  }

  return html;
}

app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "maison-loire-evasion" });
});

app.get("/index.html", (_req, res) => {
  res.redirect(301, "/");
});

app.use(
  express.static(staticPath, {
    index: false,
    maxAge: "7d",
    setHeaders(res, filePath) {
      if (filePath.endsWith("index.html") || filePath.endsWith("admin/config.yml")) {
        res.setHeader("Cache-Control", "no-store");
      }
    },
  }),
);

app.get(["/admin", "/admin/"], (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.sendFile(path.join(staticPath, "admin", "index.html"));
});

// Direct links receive an app shell with server-rendered SEO metadata.
app.get("*", (req, res) => {
  if (req.path === "/" && !/(?:^|;\s*)site-language=(?:fr|en)(?:;|$)/.test(req.headers.cookie ?? "")) {
    const preferredLanguage = req.acceptsLanguages("en", "fr");
    if (preferredLanguage === "en") {
      res.redirect(302, "/en");
      return;
    }
  }

  if (req.path !== "/" && req.path.endsWith("/")) {
    const target = req.path.replace(/\/+$/, "") || "/";
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    res.redirect(301, `${target}${query}`);
    return;
  }

  if (path.extname(req.path)) {
    res.status(404).type("text/plain").send("Not found");
    return;
  }

  const page = req.path === "/404" || req.path === "/en/404" ? undefined : seoPages.get(req.path);
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Language", page?.language ?? (req.path.startsWith("/en") ? "en" : "fr"));
  res.status(page ? 200 : 404).type("html").send(renderAppShell(page, req.path));
});

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const host = process.env.HOST ?? "127.0.0.1";

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

server.listen(port, host, () => {
  console.log(`Maison Loire Evasion listening on http://${host}:${port}`);
});

function shutdown(signal: NodeJS.Signals) {
  console.log(`${signal} received, shutting down`);
  server.close((error) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
