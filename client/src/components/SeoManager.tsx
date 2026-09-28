import { useEffect } from "react";
import { useLocation } from "wouter";
import around from "@/content/around.json";
import chateaux from "@/content/chateaux.json";
import home from "@/content/home.json";
import leisure from "@/content/leisure.json";
import maison from "@/content/maison.json";
import outdoors from "@/content/outdoors.json";
import stays from "@/content/stays.json";
import useful from "@/content/useful.json";
import aroundEn from "@/content/around.en.json";
import chateauxEn from "@/content/chateaux.en.json";
import homeEn from "@/content/home.en.json";
import leisureEn from "@/content/leisure.en.json";
import maisonEn from "@/content/maison.en.json";
import outdoorsEn from "@/content/outdoors.en.json";
import staysEn from "@/content/stays.en.json";
import usefulEn from "@/content/useful.en.json";
import { findCustomPage } from "@/lib/customPages";
import { pathForLanguage, stripLanguagePrefix, useLanguage } from "@/contexts/LanguageContext";

type SeoContent = {
  seo?: {
    title?: string;
    description?: string;
    shareImage?: string;
    noIndex?: boolean;
  };
  title?: string;
  description?: string;
  hero?: {
    title?: string;
    description?: string;
    image?: string;
    mainImage?: string;
  };
  heroImage?: string;
};

const siteUrl = "https://cheverny.andrologiciels.com";
const fixedPages: Record<string, SeoContent> = {
  "/": home,
  "/maison": maison,
  "/chateaux": chateaux,
  "/autour-de-nous": around,
  "/balades": outdoors,
  "/commerces-utiles": useful,
  "/idees-de-sejour": stays,
  "/loisirs": leisure,
};

const fixedPagesEn: Record<string, SeoContent> = {
  "/": homeEn,
  "/maison": maisonEn,
  "/chateaux": chateauxEn,
  "/autour-de-nous": aroundEn,
  "/balades": outdoorsEn,
  "/commerces-utiles": usefulEn,
  "/idees-de-sejour": staysEn,
  "/loisirs": leisureEn,
};

function setMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;
}

function setAlternate(language: "fr" | "en" | "x-default", url: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${language}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = "alternate";
    element.hreflang = language;
    document.head.appendChild(element);
  }
  element.href = url;
}

export default function SeoManager() {
  const [location] = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const pathname = location === "/" ? "/" : location.replace(/\/+$/, "");
    const basePath = stripLanguagePrefix(pathname);
    const customPage = basePath.startsWith("/") ? findCustomPage(basePath.slice(1), language) : undefined;
    const content = (language === "en" ? fixedPagesEn : fixedPages)[basePath] ?? customPage;
    const notFound = !content || basePath === "/404";
    const title = notFound
      ? (language === "en" ? "Page not found | La Maison Vigneronne" : "Page introuvable | La Maison Vigneronne")
      : content.seo?.title || content.hero?.title || content.title || "La Maison Vigneronne";
    const description = notFound
      ? (language === "en" ? "This page does not exist or has been moved." : "Cette page n’existe pas ou a été déplacée.")
      : content.seo?.description || content.hero?.description || content.description || "";
    const image = notFound
      ? ""
      : content.seo?.shareImage || content.hero?.image || content.hero?.mainImage || content.heroImage || "";
    const canonical = `${siteUrl}${pathname === "/" ? "/" : pathname}`;
    const robots = notFound || content?.seo?.noIndex ? "noindex, nofollow" : "index, follow";

    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", robots);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", "website");
    setMeta('meta[property="og:locale"]', "property", "og:locale", language === "en" ? "en_GB" : "fr_FR");
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", image ? "summary_large_image" : "summary");
    if (image) {
      const absoluteImage = image.startsWith("http") ? image : `${siteUrl}${image}`;
      setMeta('meta[property="og:image"]', "property", "og:image", absoluteImage);
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", absoluteImage);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }
    setCanonical(canonical);
    const frenchUrl = `${siteUrl}${pathForLanguage(basePath, "fr")}`;
    const englishUrl = `${siteUrl}${pathForLanguage(basePath, "en")}`;
    setAlternate("fr", frenchUrl);
    setAlternate("en", englishUrl);
    setAlternate("x-default", frenchUrl);
  }, [language, location]);

  return null;
}
