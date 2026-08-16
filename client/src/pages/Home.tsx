/**
 * Direction « Carnet de terroir » : la vraie maison reste centrale, mise en scène par
 * une promenade éditoriale, chaleureuse et asymétrique qui relie séjour et territoire.
 */
import {
  ArrowRight,
  Bath,
  BedDouble,
  Bike,
  Castle,
  ChevronRight,
  MapPin,
  TreePine,
  Users,
  Wine,
} from "lucide-react";
import { Link } from "wouter";
import SiteLayout, { BookingButton } from "@/components/SiteLayout";

const details = [
  { icon: Users, value: "8", label: "voyageurs" },
  { icon: BedDouble, value: "4", label: "chambres" },
  { icon: Bath, value: "2", label: "salles de bain" },
  { icon: TreePine, value: "700 m²", label: "de jardin clos" },
];

const directions = [
  {
    to: "/chateaux",
    number: "01",
    icon: Castle,
    title: "Les châteaux en majesté",
    copy: "Cheverny à pied, Chambord à vélo, Blois et de précieux domaines plus secrets.",
  },
  {
    to: "/autour-de-nous",
    number: "02",
    icon: Wine,
    title: "Dans un rayon de 30 km",
    copy: "Vignobles, villages, jardins, patrimoine et haltes gourmandes pour choisir chaque journée.",
  },
  {
    to: "/balades",
    number: "03",
    icon: Bike,
    title: "À pied, à vélo, à son rythme",
    copy: "Routes tranquilles, chemins de Sologne et boucles officielles au départ de Cheverny.",
  },
];

export default function Home() {
  return (
    <SiteLayout>
      <section className="home-hero">
        <div className="hero-intro">
          <p className="eyebrow"><span>41700</span> Cour-Cheverny · Val de Loire</p>
          <h1>
            Une maison où <em>la Loire</em> se vit à votre rythme.
          </h1>
          <p className="hero-lead">
            Une maison vigneronne du XIX<sup>e</sup> siècle, lumineuse et généreuse, pour se retrouver en famille ou entre amis au cœur des châteaux et des vignobles.
          </p>
          <div className="hero-actions">
            <BookingButton />
            <a className="text-link" href="#maison">Découvrir la maison <ArrowRight size={16} /></a>
          </div>
          <p className="hero-mini-note">À 10 min à pied du château de Cheverny</p>
        </div>

        <div className="hero-photo-stack" aria-label="Aperçu de la maison">
          <img
            className="hero-photo-main"
            src="/manus-storage/maison-exterieur_57eb8c38.jpg"
            alt="La façade et le jardin de la Maison Vigneronne"
          />
          <figure className="hero-vignette">
            <img
              src="/manus-storage/loire-vineyard-hero_0ede957b.jpg"
              alt="Paysage de vignes du Val de Loire"
            />
            <figcaption>Au cœur des vignes de Cheverny</figcaption>
          </figure>
          <div className="hero-stamp">
            <span>Maison<br />de<br />vigneron</span>
          </div>
        </div>
      </section>

      <section id="maison" className="amenities-band">
        <p className="eyebrow">La maison en quelques mots</p>
        <div className="amenities-grid">
          {details.map(({ icon: Icon, value, label }) => (
            <div className="amenity" key={label}>
              <Icon size={18} strokeWidth={1.7} />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-aside">
          <p className="vertical-note">La maison · le jardin · les vignes</p>
          <div className="story-marker"><span>01</span></div>
        </div>
        <div className="story-image">
          <img src="/manus-storage/maison-salon_4bae837c.jpg" alt="Salon chaleureux de la maison" />
        </div>
        <div className="story-copy">
          <p className="eyebrow">Un lieu pour se retrouver</p>
          <h2>Des volumes pour les grandes tablées, des recoins pour souffler.</h2>
          <p>
            Les 160 m² de la maison accueillent les séjours qui prennent le temps : un salon convivial, une grande salle à manger, une cuisine très équipée et un espace détente à l’étage, jusqu’à la borne d’arcade pour les retours de visite.
          </p>
          <p>
            Dehors, le jardin arboré et entièrement clos accompagne les petits-déjeuners au soleil, les parties de pétanque et les fins d’après-midi sans programme.
          </p>
          <Link href="/maison" className="arrow-link">Visiter la maison <ChevronRight size={18} /></Link>
        </div>
      </section>

      <section className="portrait-grid-section">
        <div className="portrait-image tall-image">
          <img src="/manus-storage/maison-terrasse_f42d2c07.jpg" alt="Terrasse de la maison ensoleillée" />
          <p>Le matin, la cour ; le soir, le jardin.</p>
        </div>
        <div className="territory-manifesto">
          <p className="eyebrow"><MapPin size={14} /> Le bon point de départ</p>
          <h2>Sortir, découvrir,<br /><em>revenir doucement.</em></h2>
          <p>
            Ici, les grandes visites ne demandent pas de renoncer aux plaisirs simples. Cheverny se rejoint à pied, Chambord s’atteint par une agréable piste cyclable et les commerces du bourg restent tout proches.
          </p>
          <Link className="underline-link" href="/autour-de-nous">Explorer les alentours</Link>
        </div>
        <div className="portrait-image small-image">
          <img src="/manus-storage/maison-salle-a-manger_55bd9810.jpg" alt="Salle à manger de la Maison Vigneronne" />
        </div>
      </section>

      <section className="route-section">
        <div className="route-heading">
          <p className="eyebrow">Composer votre séjour</p>
          <h2>Chaque jour, une nouvelle échappée.</h2>
          <p>Trois façons de partir de la maison, sans jamais être loin de ce qui compte.</p>
        </div>
        <div className="route-list">
          {directions.map(({ to, number, icon: Icon, title, copy }) => (
            <Link href={to} className="route-item" key={number}>
              <span className="route-number">{number}</span>
              <Icon className="route-icon" size={25} strokeWidth={1.5} />
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
              <ArrowRight className="route-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <img src="/manus-storage/maison-facade_71465e76.jpg" alt="Façade lumineuse de la maison" />
        <div className="home-cta-overlay" />
        <div className="home-cta-copy">
          <p className="eyebrow">Le séjour peut commencer</p>
          <h2>Choisissez votre date,<br />nous préparons la maison.</h2>
          <BookingButton />
        </div>
      </section>
    </SiteLayout>
  );
}

