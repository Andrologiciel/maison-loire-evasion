/**
 * Direction « Carnet de terroir » : carte schématique interactive, comme une page
 * de carnet de route. Les repères sont cliquables et renvoient vers les sources officielles.
 */
import { Bike, Castle, Grape, House, MapPin, Route, X } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "home" | "castle" | "walk" | "bike" | "terroir";
type Filter = "all" | Exclude<Category, "home">;

export type MapPoint = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  url?: string;
};

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

export default function InteractiveMap({ kicker, title, text, points }: { kicker: string; title: string; text: string; points: MapPoint[] }) {
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
          <p className="eyebrow"><MapPin size={14} /> {kicker}</p>
          <h2 id="map-title">{title}</h2>
        </div>
        <p>{text}</p>
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
          {selectedPoint.url && <a href={selectedPoint.url} target="_blank" rel="noreferrer">Ouvrir la fiche officielle ↗</a>}
        </article>
      </div>

      <div className="map-legend" aria-label="Légende de la carte">
        <span><House size={13} /> La maison</span><span><Castle size={13} /> Châteaux</span><span><Route size={13} /> Randonnées</span><span><Bike size={13} /> Vélo</span><span><Grape size={13} /> Terroir</span>
      </div>
    </section>
  );
}
