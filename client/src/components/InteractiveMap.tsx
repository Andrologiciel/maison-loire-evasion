/**
 * Direction « Carnet de terroir » : carte schématique interactive, comme une page
 * de carnet de route. Les repères sont cliquables et renvoient vers les sources officielles.
 */
import { Bike, Castle, Grape, House, MapPin, Route, X } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "home" | "castle" | "walk" | "bike" | "terroir";
type Filter = "all" | Exclude<Category, "home">;

type MapPoint = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  href?: string;
};

const points: MapPoint[] = [
  { id: "home", category: "home", title: "Votre point de départ", subtitle: "Cour-Cheverny", description: "Un repère volontairement situé au cœur du village, sans divulguer l’adresse de la maison.", x: 59, y: 75 },
  { id: "cheverny", category: "castle", title: "Château de Cheverny", subtitle: "À environ 10 min à pied", description: "Intérieurs, jardins et univers de Moulinsart, à proximité immédiate de Cour-Cheverny.", x: 59, y: 81, href: "https://www.chateau-cheverny.fr/" },
  { id: "chambord", category: "castle", title: "Domaine de Chambord", subtitle: "Château, parc et jardins", description: "Le vaste domaine de Chambord et son château Renaissance, à prévoir sur une demi-journée ou une journée.", x: 83, y: 9, href: "https://www.chambord.org/" },
  { id: "blois", category: "castle", title: "Château royal de Blois", subtitle: "Centre historique de Blois", description: "Un ensemble royal au cœur de Blois, à associer à une promenade dans les ruelles et sur les quais.", x: 9, y: 28, href: "https://www.chateaudeblois.fr/" },
  { id: "beauregard", category: "castle", title: "Parc & Château de Beauregard", subtitle: "Cellettes", description: "Un domaine à découvrir pour son parc et son importante galerie de portraits historiques.", x: 28, y: 54, href: "https://www.val-de-loire-41.com/visite/parc-chateau-de-beauregard-pcu41aasor100129/" },
  { id: "villesavin", category: "castle", title: "Château de Villesavin", subtitle: "Tour-en-Sologne", description: "Un château plus confidentiel aux portes de Chambord, souvent évoqué sur les boucles vélo du secteur.", x: 94, y: 56, href: "https://www.val-de-loire-41.com/visite/chateau-de-villesavin-pcu41aasor100136/" },
  { id: "troussay", category: "castle", title: "Château de Troussay", subtitle: "Près de Cheverny", description: "Un petit château au milieu des vignes, à envisager pour une halte plus intimiste.", x: 71, y: 91, href: "https://www.valdeloire-france.com/site-culturel/chateau-de-troussay/" },
  { id: "jouvancay", category: "walk", title: "Départ Cour-Cheverny – Jouvançay", subtitle: "Boucle facile · 9,4 km · env. 2 h 40", description: "Départ recommandé depuis la salle des fêtes, pour une boucle balisée par la FFRandonnée 41.", x: 55, y: 72, href: "https://www.bloischambord.com/visites-et-activites/balades-et-visites/rando-cour-cheverny-jouvancay-cour-cheverny-fr-5395609/" },
  { id: "serigny", category: "walk", title: "Les Bruyères de Sérigny", subtitle: "Boucle facile · 12,8 km · env. 3 h 40", description: "Une randonnée pour rejoindre les paysages de Sologne. Consultez la fiche de parcours avant le départ.", x: 44, y: 67, href: "https://www.bloischambord.com/en/tours-and-activities/walks-and-visits/les-bruyeres-de-serigny-de-cour-cherverny-cour-cheverny-en-5395608/" },
  { id: "circuit-chateau", category: "walk", title: "Le Circuit du Château", subtitle: "Boucle · 17,8 km", description: "Un départ à Cheverny pour marcher entre le village, les paysages ruraux et le patrimoine local.", x: 55, y: 85, href: "https://www.bloischambord.com/visites-et-activites/balades-et-visites/le-circuit-du-chateau-a-cheverny-cheverny-fr-5395591/" },
  { id: "ombres-lumieres", category: "bike", title: "Boucle 05 · Ombres & Lumières", subtitle: "Vignobles de Cour-Cheverny", description: "Une boucle officielle qui relie Cour-Cheverny, ses vignes et le château de Villesavin.", x: 64, y: 75, href: "https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" },
  { id: "vignobles-chateaux", category: "bike", title: "Boucle 04B · Entre Vignobles & Châteaux", subtitle: "Cellettes · Chitenay · Cheverny", description: "Une proposition autour des vignobles et des châteaux, avec plusieurs villages en chemin.", x: 66, y: 80, href: "https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" },
  { id: "royaume-cerf", category: "bike", title: "Boucle 06 · Au Royaume du Cerf", subtitle: "Cheverny · Fontaines-en-Sologne", description: "Une sortie officielle vers les paysages boisés de Sologne et le village de Fontaines-en-Sologne.", x: 62, y: 87, href: "https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" },
  { id: "maison-vins", category: "terroir", title: "Maison des vins de Cheverny", subtitle: "Cheverny", description: "Un arrêt pour découvrir les vins du secteur et préparer une visite chez les vignerons.", x: 64, y: 83, href: "https://www.val-de-loire-41.com/degustation/maison-des-vins-de-cheverny-degcen0410001691/" },
];

const filters: Array<{ id: Filter; label: string; icon: typeof Castle }> = [
  { id: "all", label: "Tout voir", icon: MapPin },
  { id: "castle", label: "Châteaux", icon: Castle },
  { id: "walk", label: "Randonnées", icon: Route },
  { id: "bike", label: "Vélo", icon: Bike },
  { id: "terroir", label: "Terroir", icon: Grape },
];

function glyphFor(category: Category) {
  if (category === "home") return "⌂";
  if (category === "castle") return "⌁";
  if (category === "walk") return "↝";
  if (category === "bike") return "◉";
  return "✦";
}

export default function InteractiveMap() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState("home");
  const visiblePoints = useMemo(
    () => points.filter((point) => point.category === "home" || filter === "all" || point.category === filter),
    [filter],
  );
  const selectedPoint = points.find((point) => point.id === selectedId) ?? points[0];

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    if (nextFilter !== "all" && selectedPoint.category !== "home" && selectedPoint.category !== nextFilter) {
      setSelectedId("home");
    }
  }

  return (
    <section className="interactive-map-section" aria-labelledby="map-title">
      <div className="map-section-heading">
        <div>
          <p className="eyebrow"><MapPin size={14} /> Carte des échappées</p>
          <h2 id="map-title">Repérez vos envies autour de la maison.</h2>
        </div>
        <p>
          Filtrez les repères et cliquez sur une pastille pour ouvrir sa fiche. Les points de randonnée et de vélo indiquent les départs ou les zones de boucle.
        </p>
      </div>

      <div className="map-filters" role="group" aria-label="Filtrer les points sur la carte">
        {filters.map(({ id, label, icon: Icon }) => (
          <button type="button" key={id} className={filter === id ? "map-filter active" : "map-filter"} onClick={() => selectFilter(id)} aria-pressed={filter === id}>
            <Icon size={15} strokeWidth={1.6} /> {label}
          </button>
        ))}
      </div>

      <div className="map-frame schematic-map" aria-label="Carte interactive des environs de Cour-Cheverny">
        <span className="map-distance-stamp">Autour de<br /><strong>Cour-Cheverny</strong></span>
        <svg viewBox="0 0 1000 570" className="map-sketch" role="img" aria-label="Schéma géographique des alentours de Cour-Cheverny">
          <path className="map-river" d="M-40 131 C120 89 175 177 310 136 S535 68 652 124 S849 204 1050 97" />
          <path className="map-road major" d="M63 184 C207 260 320 281 442 343 S684 405 842 477" />
          <path className="map-road" d="M203 482 C345 407 443 394 550 349 S708 248 900 184" />
          <path className="map-road" d="M485 533 C512 448 556 360 655 270 S795 128 936 72" />
          <path className="map-road dotted" d="M292 485 C385 519 489 509 611 473 S752 446 929 514" />
          <circle className="map-radius-circle" cx="590" cy="417" r="173" />
          <text x="65" y="113" className="map-place-label">La Loire</text>
          <text x="70" y="235" className="map-city-label">Blois</text>
          <text x="812" y="71" className="map-city-label">Chambord</text>
          <text x="719" y="523" className="map-region-label">Sologne</text>
          <text x="445" y="535" className="map-region-label">Vignes de Cheverny</text>
        </svg>

        {visiblePoints.map((point) => (
          <button
            type="button"
            key={point.id}
            className={`map-marker ${point.category} ${selectedId === point.id ? "selected" : ""}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={() => setSelectedId(point.id)}
            aria-label={`Afficher ${point.title}`}
            aria-pressed={selectedId === point.id}
          >
            <span>{glyphFor(point.category)}</span>
          </button>
        ))}

        <article className="map-point-card" aria-live="polite">
          <button type="button" className="map-card-close" onClick={() => setSelectedId("home")} aria-label="Revenir au point de départ"><X size={13} /></button>
          <p>{selectedPoint.subtitle}</p>
          <h3>{selectedPoint.title}</h3>
          <span>{selectedPoint.description}</span>
          {selectedPoint.href && <a href={selectedPoint.href} target="_blank" rel="noreferrer">Ouvrir la fiche officielle ↗</a>}
        </article>
      </div>

      <div className="map-legend" aria-label="Légende de la carte">
        <span><House size={13} /> La maison</span><span><Castle size={13} /> Châteaux</span><span><Route size={13} /> Randonnées</span><span><Bike size={13} /> Vélo</span><span><Grape size={13} /> Terroir</span>
      </div>
    </section>
  );
}

