/**
 * Direction « Carnet de terroir » : une recherche calme, éditoriale et orientée parcours.
 * Elle relie sans friction chaque envie de séjour à la bonne page du site.
 */
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { customPages, customPagesEn } from "@/lib/customPages";
import { useLanguage } from "@/contexts/LanguageContext";

type SearchOverlayProps = { onClose: () => void };

const frenchResults = [
  { title: "La Maison Vigneronne", description: "Capacité, pièces de vie, jardin clos et réservation.", href: "/maison", category: "La maison", keywords: "maison jardin chambres salon cuisine réservation" },
  { title: "Les châteaux de la Loire", description: "Cheverny, Chambord, Blois et les domaines plus confidentiels.", href: "/chateaux", category: "Visites", keywords: "chateau cheverny chambord blois beauregard villesavin troussay" },
  { title: "Curiosités à moins de 30 km", description: "Vignobles, villages, patrimoine et saveurs locales.", href: "/autour-de-nous", category: "À découvrir", keywords: "vignoble vin village terroir patrimoine blois" },
  { title: "À pied & à vélo", description: "Boucles vélo, randonnées et départs de parcours autour de Cheverny.", href: "/balades", category: "Plein air", keywords: "velo randonnée marche chemin vélo pistes cyclables" },
  { title: "Commerces et lieux utiles", description: "Pharmacie, maison de santé, services et commerces de proximité.", href: "/commerces-utiles", category: "Pratique", keywords: "commerce pharmacie santé medecin médecin supermarché boulangerie urgence" },
  { title: "Idées de séjour", description: "Week-end, 3 jours, une semaine ou séjour prolongé, selon vos envies.", href: "/idees-de-sejour", category: "Inspiration", keywords: "week end weekend trois jours semaine deux semaines repos détente visites programme" },
  { title: "Loisirs & activités", description: "Beauval, baignade, canoë, nature et sorties à partager.", href: "/loisirs", category: "Loisirs", keywords: "beauval zoo baignade canoe canoë kayak cheval famille loisirs" },
];

const englishResults = [
  { title: "La Maison Vigneronne", description: "Capacity, living spaces, enclosed garden and booking.", href: "/maison", category: "The house", keywords: "house garden bedrooms lounge kitchen booking" },
  { title: "Loire Valley castles", description: "Cheverny, Chambord, Blois and quieter historic estates.", href: "/chateaux", category: "Visits", keywords: "castle cheverny chambord blois beauregard villesavin troussay" },
  { title: "Within 30 kilometres", description: "Vineyards, villages, heritage and local flavours.", href: "/autour-de-nous", category: "Discover", keywords: "vineyard wine village heritage blois" },
  { title: "Walking & cycling", description: "Cycle loops and walking routes around Cheverny.", href: "/balades", category: "Outdoors", keywords: "bike cycle walking paths routes" },
  { title: "Useful shops and places", description: "Pharmacy, health centre, services and local shops.", href: "/commerces-utiles", category: "Practical", keywords: "shop pharmacy health doctor supermarket bakery emergency" },
  { title: "Stay ideas", description: "A weekend, three days, a week or a longer stay.", href: "/idees-de-sejour", category: "Inspiration", keywords: "weekend three days week rest sightseeing itinerary" },
  { title: "Leisure & activities", description: "Beauval, swimming, canoeing and nature outings.", href: "/loisirs", category: "Activities", keywords: "beauval zoo swimming canoe kayak horse family" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const { language, localizedPath } = useLanguage();
  const customResults = (language === "en" ? customPagesEn : customPages).map((page) => ({
    title: page.title,
    description: page.description,
    href: `/${page.slug}`,
    category: page.kicker || "Page",
    keywords: `${page.title} ${page.description} ${page.sections.map((section) => `${section.title} ${section.text}`).join(" ")}`,
  }));
  const results = [...(language === "en" ? englishResults : frenchResults), ...customResults];
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = normalize(query.trim());
  const matchingResults = useMemo(
    () => results.filter((item) => !normalizedQuery || normalize(`${item.title} ${item.description} ${item.keywords}`).includes(normalizedQuery)),
    [language, normalizedQuery],
  );

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={language === "en" ? "Search the website" : "Rechercher sur le site"}>
      <div className="search-dialog">
        <div className="search-dialog-top"><p className="eyebrow"><Search size={14} /> {language === "en" ? "Search the guide" : "Rechercher dans le carnet"}</p><button type="button" onClick={onClose} className="search-close" aria-label={language === "en" ? "Close search" : "Fermer la recherche"}><X size={20} /></button></div>
        <label className="search-input-wrap"><Search size={22} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={language === "en" ? "E.g. Beauval, cycling, pharmacy…" : "Ex. Beauval, vélo, détente, pharmacie…"} aria-label={language === "en" ? "Your search" : "Votre recherche"} /><kbd>{language === "en" ? "Esc" : "Échap"}</kbd></label>
        <div className="search-result-meta"><span>{normalizedQuery ? (language === "en" ? `${matchingResults.length} result${matchingResults.length === 1 ? "" : "s"}` : `${matchingResults.length} résultat${matchingResults.length > 1 ? "s" : ""}`) : (language === "en" ? "All sections" : "Toutes les rubriques")}</span><p>{language === "en" ? "Try “canoe”, “3 days”, “health” or “Chambord”." : "Essayez « canoë », « 3 jours », « santé » ou « Chambord »."}</p></div>
        <div className="search-result-list">
          {matchingResults.map((item, index) => <Link key={item.href} href={localizedPath(item.href)} className="search-result" onClick={onClose}><span className="search-result-index">0{index + 1}</span><div><p>{item.category}</p><h3>{item.title}</h3><span>{item.description}</span></div><ArrowUpRight size={18} /></Link>)}
          {matchingResults.length === 0 && <div className="search-empty"><p className="eyebrow">{language === "en" ? "Nothing found" : "Aucun repère trouvé"}</p><h3>{language === "en" ? "Try another word or explore the sections above." : "Essayez un autre mot ou explorez les rubriques ci-dessus."}</h3></div>}
        </div>
      </div>
    </div>
  );
}
