/**
 * Direction « Carnet de terroir » : carte schématique utile, calme et très lisible.
 * Les points vérifiés complètent des recherches cartographiques ouvertes et actualisées.
 */
import { Cross, MapPin, ShoppingBasket, Stethoscope, X } from "lucide-react";
import { useMemo, useState } from "react";

type Category = "home" | "shop" | "health" | "service";
type Filter = "all" | Exclude<Category, "home">;

type UsefulPoint = {
  id: string;
  category: Category;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  href?: string;
};

const places: UsefulPoint[] = [
  { id: "home", category: "home", title: "Votre repère de séjour", subtitle: "Cour-Cheverny", description: "Un point indicatif au cœur du village, choisi pour préserver l’adresse précise de la maison.", x: 56, y: 76 },
  { id: "boulangerie", category: "shop", title: "Boulangerie Pohu", subtitle: "70 rue Nationale · Cour-Cheverny", description: "Une adresse de proximité référencée par la mairie, pratique pour les viennoiseries et le pain du matin.", x: 59, y: 72, href: "https://www.google.com/maps/search/?api=1&query=Boulangerie+Pohu+70+rue+Nationale+Cour-Cheverny" },
  { id: "tabac", category: "shop", title: "Tabac Presse Harmonie", subtitle: "83 rue Nationale · Cour-Cheverny", description: "Tabac et presse parmi les commerces répertoriés dans le bourg.", x: 63, y: 70, href: "https://www.google.com/maps/search/?api=1&query=Tabac+Presse+Harmonie+Cour-Cheverny" },
  { id: "pharmacie", category: "health", title: "Pharmacie Lebegue-Ribault", subtitle: "10 place Victor-Hugo · Cour-Cheverny", description: "Pharmacie d’officine. Les horaires et services sont à vérifier directement avant le déplacement.", x: 54, y: 70, href: "https://www.sante.fr/pharmacie-dofficine/cour-cheverny/pharmacie-lebegue-ribault" },
  { id: "msu", category: "health", title: "Maison de Santé Universitaire", subtitle: "36 route de Romorantin · Cheverny", description: "Maison de santé de proximité. Consultez les modalités de prise en charge et les disponibilités avant de vous y rendre.", x: 56, y: 81, href: "https://mairie-cheverny.com/vie-pratique/numeros-utiles/" },
  { id: "hospital", category: "health", title: "Centre Hospitalier Simone Veil", subtitle: "Blois", description: "Établissement hospitalier de référence à Blois. En cas d’urgence vitale, appelez le 15.", x: 14, y: 28, href: "https://ch-blois.com/" },
  { id: "bank", category: "service", title: "Crédit Agricole", subtitle: "5 place Victor-Hugo · Cour-Cheverny", description: "Agence bancaire de proximité, référencée par la mairie de Cour-Cheverny.", x: 49, y: 73, href: "https://www.google.com/maps/search/?api=1&query=Cr%C3%A9dit+Agricole+5+place+Victor+Hugo+Cour-Cheverny" },
  { id: "auto", category: "service", title: "Services automobile", subtitle: "Zone de l’Ardoise · Cour-Cheverny", description: "Plusieurs garages et services automobiles sont recensés dans la zone de l’Ardoise.", x: 68, y: 82, href: "https://www.google.com/maps/search/?api=1&query=garage+automobile+Cour-Cheverny" },
];

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

export default function UsefulPlacesMap() {
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
          <p className="eyebrow"><MapPin size={14} /> Carte des utiles</p>
          <h2 id="useful-map-title">Le nécessaire, au bon endroit.</h2>
        </div>
        <p>
          Commencez par les repères vérifiés dans le bourg, puis utilisez les accès ci-dessous pour élargir votre recherche à l’ensemble du périmètre de 30 km.
        </p>
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
          {selectedPlace.href && <a href={selectedPlace.href} target="_blank" rel="noreferrer">Ouvrir la fiche ou la recherche ↗</a>}
        </article>
      </div>

      <div className="useful-map-legend" aria-label="Légende de la carte des utiles">
        <span><span className="legend-dot home" /> Votre repère</span><span><span className="legend-dot shop" /> Commerces</span><span><span className="legend-dot health" /> Santé</span><span><span className="legend-dot service" /> Services</span>
      </div>
    </section>
  );
}

