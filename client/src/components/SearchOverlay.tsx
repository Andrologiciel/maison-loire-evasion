/**
 * Direction « Carnet de terroir » : une recherche calme, éditoriale et orientée parcours.
 * Elle relie sans friction chaque envie de séjour à la bonne page du site.
 */
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";

type SearchOverlayProps = { onClose: () => void };

const results = [
  { title: "La Maison Vigneronne", description: "Capacité, pièces de vie, jardin clos et réservation.", href: "/maison", category: "La maison", keywords: "maison jardin chambres salon cuisine réservation" },
  { title: "Les châteaux de la Loire", description: "Cheverny, Chambord, Blois et les domaines plus confidentiels.", href: "/chateaux", category: "Visites", keywords: "chateau cheverny chambord blois beauregard villesavin troussay" },
  { title: "Curiosités à moins de 30 km", description: "Vignobles, villages, patrimoine et saveurs locales.", href: "/autour-de-nous", category: "À découvrir", keywords: "vignoble vin village terroir patrimoine blois" },
  { title: "À pied & à vélo", description: "Boucles vélo, randonnées et départs de parcours autour de Cheverny.", href: "/balades", category: "Plein air", keywords: "velo randonnée marche chemin vélo pistes cyclables" },
  { title: "Commerces et lieux utiles", description: "Pharmacie, maison de santé, services et commerces de proximité.", href: "/commerces-utiles", category: "Pratique", keywords: "commerce pharmacie santé medecin médecin supermarché boulangerie urgence" },
  { title: "Idées de séjour", description: "Week-end, 3 jours, une semaine ou séjour prolongé, selon vos envies.", href: "/idees-de-sejour", category: "Inspiration", keywords: "week end weekend trois jours semaine deux semaines repos détente visites programme" },
  { title: "Loisirs & activités", description: "Beauval, baignade, canoë, nature et sorties à partager.", href: "/loisirs", category: "Loisirs", keywords: "beauval zoo baignade canoe canoë kayak cheval famille loisirs" },
];

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = normalize(query.trim());
  const matchingResults = useMemo(
    () => results.filter((item) => !normalizedQuery || normalize(`${item.title} ${item.description} ${item.keywords}`).includes(normalizedQuery)),
    [normalizedQuery],
  );

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Rechercher sur le site">
      <div className="search-dialog">
        <div className="search-dialog-top"><p className="eyebrow"><Search size={14} /> Rechercher dans le carnet</p><button type="button" onClick={onClose} className="search-close" aria-label="Fermer la recherche"><X size={20} /></button></div>
        <label className="search-input-wrap"><Search size={22} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. Beauval, vélo, détente, pharmacie…" aria-label="Votre recherche" /><kbd>Échap</kbd></label>
        <div className="search-result-meta"><span>{normalizedQuery ? `${matchingResults.length} résultat${matchingResults.length > 1 ? "s" : ""}` : "Toutes les rubriques"}</span><p>Essayez « canoë », « 3 jours », « santé » ou « Chambord ».</p></div>
        <div className="search-result-list">
          {matchingResults.map((item, index) => <Link key={item.href} href={item.href} className="search-result" onClick={onClose}><span className="search-result-index">0{index + 1}</span><div><p>{item.category}</p><h3>{item.title}</h3><span>{item.description}</span></div><ArrowUpRight size={18} /></Link>)}
          {matchingResults.length === 0 && <div className="search-empty"><p className="eyebrow">Aucun repère trouvé</p><h3>Essayez un autre mot ou explorez les rubriques ci-dessus.</h3></div>}
        </div>
      </div>
    </div>
  );
}

