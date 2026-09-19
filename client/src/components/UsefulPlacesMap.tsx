/**
 * Direction « Carnet de terroir » : carte schématique utile, calme et très lisible.
 * Les points vérifiés complètent des recherches cartographiques ouvertes et actualisées.
 */
import { Cross, MapPin, ShoppingBasket, Stethoscope, X } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "home" | "shop" | "health" | "service";
type Filter = "all" | Exclude<Category, "home">;

export type UsefulPoint = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  url?: string;
};

const filters: Array<{ id: Filter; label: string; icon: typeof MapPin }> = [
  { id: "all", label: "Tout voir", icon: MapPin },
  { id: "shop", label: "Commerces", icon: ShoppingBasket },
  { id: "health", label: "Santé", icon: Cross },
  { id: "service", label: "Services", icon: Stethoscope },
];

function glyphFor(category: Category) {
  if (category === "home") return "⌂";
  if (category === "shop") return "✦";
  if (category === "health") return "+";
  return "◇";
}

export default function UsefulPlacesMap({ kicker, title, text, places }: { kicker: string; title: string; text: string; places: UsefulPoint[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState("home");
  const visiblePlaces = useMemo(
    () => places.filter((place) => place.category === "home" || filter === "all" || place.category === filter),
    [filter],
  );
  const selectedPlace = places.find((place) => place.id === selectedId) ?? places[0];

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    if (nextFilter !== "all" && selectedPlace.category !== "home" && selectedPlace.category !== nextFilter) {
      setSelectedId("home");
    }
  }

  return (
    <section className="useful-map-section" aria-labelledby="useful-map-title">
      <div className="useful-map-heading">
        <div>
          <p className="eyebrow"><MapPin size={14} /> {kicker}</p>
          <h2 id="useful-map-title">{title}</h2>
        </div>
        <p>{text}</p>
      </div>

      <div className="map-filters" role="group" aria-label="Filtrer les lieux utiles sur la carte">
        {filters.map(({ id, label, icon: Icon }) => (
          <button type="button" key={id} className={filter === id ? "map-filter active" : "map-filter"} onClick={() => selectFilter(id)} aria-pressed={filter === id}>
            <Icon size={15} strokeWidth={1.6} /> {label}
          </button>
        ))}
      </div>

      <div className="map-frame schematic-map useful-schematic-map" aria-label="Carte des commerces, pharmacies et établissements de santé">
        <span className="map-distance-stamp">Rayon de<br /><strong>30 km</strong></span>
        <svg viewBox="0 0 1000 570" className="map-sketch" role="img" aria-label="Schéma de Cour-Cheverny, Blois et des services utiles alentour">
          <path className="map-river" d="M-40 131 C120 89 175 177 310 136 S535 68 652 124 S849 204 1050 97" />
          <path className="map-road major" d="M63 184 C207 260 320 281 442 343 S684 405 842 477" />
          <path className="map-road" d="M203 482 C345 407 443 394 550 349 S708 248 900 184" />
          <path className="map-road dotted" d="M292 485 C385 519 489 509 611 473 S752 446 929 514" />
          <circle className="map-radius-circle" cx="565" cy="420" r="189" />
          <text x="65" y="113" className="map-place-label">La Loire</text>
          <text x="70" y="235" className="map-city-label">Blois</text>
          <text x="690" y="522" className="map-region-label">Sologne</text>
          <text x="431" y="535" className="map-region-label">Vignes de Cheverny</text>
        </svg>

        {visiblePlaces.map((place) => (
          <button type="button" key={place.id} className={`map-marker useful-marker ${place.category} ${selectedId === place.id ? "selected" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={() => setSelectedId(place.id)} aria-label={`Afficher ${place.title}`} aria-pressed={selectedId === place.id}>
            <span>{glyphFor(place.category)}</span>
          </button>
        ))}

        <article className="map-point-card" aria-live="polite">
          <button type="button" className="map-card-close" onClick={() => setSelectedId("home")} aria-label="Revenir au point de départ"><X size={13} /></button>
          <p>{selectedPlace.subtitle}</p>
          <h3>{selectedPlace.title}</h3>
          <span>{selectedPlace.description}</span>
          {selectedPlace.url && <a href={selectedPlace.url} target="_blank" rel="noreferrer">Ouvrir la fiche ou la recherche ↗</a>}
        </article>
      </div>

      <div className="useful-map-legend" aria-label="Légende de la carte des utiles">
        <span><span className="legend-dot home" /> Votre repère</span><span><span className="legend-dot shop" /> Commerces</span><span><span className="legend-dot health" /> Santé</span><span><span className="legend-dot service" /> Services</span>
      </div>
    </section>
  );
}
