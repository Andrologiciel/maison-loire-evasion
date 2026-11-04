import siteFr from "../client/src/content/site.json";
import siteEn from "../client/src/content/site.en.json";
import homeFr from "../client/src/content/home.json";
import homeEn from "../client/src/content/home.en.json";
import maisonFr from "../client/src/content/maison.json";
import maisonEn from "../client/src/content/maison.en.json";
import chateauxFr from "../client/src/content/chateaux.json";
import chateauxEn from "../client/src/content/chateaux.en.json";
import aroundFr from "../client/src/content/around.json";
import aroundEn from "../client/src/content/around.en.json";
import outdoorsFr from "../client/src/content/outdoors.json";
import outdoorsEn from "../client/src/content/outdoors.en.json";
import usefulFr from "../client/src/content/useful.json";
import usefulEn from "../client/src/content/useful.en.json";
import staysFr from "../client/src/content/stays.json";
import staysEn from "../client/src/content/stays.en.json";
import leisureFr from "../client/src/content/leisure.json";
import leisureEn from "../client/src/content/leisure.en.json";

export const SITE_URL = "https://cheverny.andrologiciels.com";
export const LANGUAGES = ["fr", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

export const PAGE_SLUGS = [
  "home",
  "maison",
  "chateaux",
  "autour-de-nous",
  "balades",
  "commerces-utiles",
  "idees-de-sejour",
  "loisirs",
] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

type JsonObject = Record<string, unknown>;

const pageContent: Record<Language, Record<PageSlug, JsonObject>> = {
  fr: {
    home: homeFr,
    maison: maisonFr,
    chateaux: chateauxFr,
    "autour-de-nous": aroundFr,
    balades: outdoorsFr,
    "commerces-utiles": usefulFr,
    "idees-de-sejour": staysFr,
    loisirs: leisureFr,
  },
  en: {
    home: homeEn,
    maison: maisonEn,
    chateaux: chateauxEn,
    "autour-de-nous": aroundEn,
    balades: outdoorsEn,
    "commerces-utiles": usefulEn,
    "idees-de-sejour": staysEn,
    loisirs: leisureEn,
  },
};

const siteContent: Record<Language, JsonObject> = { fr: siteFr, en: siteEn };

function pagePath(language: Language, slug: PageSlug) {
  const path = slug === "home" ? "" : `/${slug}`;
  return language === "en" ? `/en${path}` : path || "/";
}

function getNestedString(value: JsonObject, ...keys: string[]) {
  let current: unknown = value;
  for (const key of keys) {
    if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
    current = (current as JsonObject)[key];
  }
  return typeof current === "string" ? current : undefined;
}

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") {
    if (!value.startsWith("/") && !/^https?:\/\//i.test(value)) output.push(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, output));
  }
  return output;
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function listPages(language: Language) {
  return PAGE_SLUGS.map((slug) => {
    const content = pageContent[language][slug];
    const path = pagePath(language, slug);
    return {
      slug,
      language,
      path,
      url: `${SITE_URL}${path}`,
      title:
        getNestedString(content, "seo", "title") ??
        getNestedString(content, "hero", "title") ??
        slug,
      description:
        getNestedString(content, "seo", "description") ??
        getNestedString(content, "hero", "description") ??
        "",
    };
  });
}

export function getPage(language: Language, slug: PageSlug) {
  const metadata = listPages(language).find((page) => page.slug === slug)!;
  return { ...metadata, content: pageContent[language][slug] };
}

export function getSiteOverview(language: Language) {
  const site = siteContent[language];
  const home = pageContent[language].home;
  return {
    name: `${getNestedString(site, "identity", "brandLine1") ?? "La Maison"} ${getNestedString(site, "identity", "brandLine2") ?? "Vigneronne"}`,
    language,
    languages: [...LANGUAGES],
    website: language === "en" ? `${SITE_URL}/en` : SITE_URL,
    location: getNestedString(site, "identity", "location") ?? "Cour-Cheverny",
    title: getNestedString(home, "seo", "title") ?? "",
    description: getNestedString(home, "seo", "description") ?? "",
    introduction: getNestedString(home, "hero", "introduction") ?? "",
    pages: listPages(language),
  };
}

export function getBookingLinks() {
  return {
    airbnb: getNestedString(siteFr, "booking", "airbnbUrl") ?? "",
    booking: getNestedString(siteFr, "booking", "bookingUrl") ?? "",
  };
}

export function searchSite(language: Language, query: string, limit = 5) {
  const tokens = normalize(query).split(" ").filter((token) => token.length > 1);
  if (tokens.length === 0) return [];

  return PAGE_SLUGS.map((slug) => {
    const page = getPage(language, slug);
    const paragraphs = collectStrings(page.content);
    const searchable = normalize([page.title, page.description, ...paragraphs].join(" "));
    const score = tokens.reduce((total, token) => {
      const matches = searchable.match(new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "g"));
      return total + (matches?.length ?? 0);
    }, 0);
    const excerpt = paragraphs.find((paragraph) => {
      const normalized = normalize(paragraph);
      return tokens.some((token) => normalized.includes(token));
    }) ?? page.description;
    return {
      slug,
      title: page.title,
      url: page.url,
      excerpt: excerpt.length > 320 ? `${excerpt.slice(0, 317)}…` : excerpt,
      score,
    };
  })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, language))
    .slice(0, Math.min(Math.max(limit, 1), 10));
}

