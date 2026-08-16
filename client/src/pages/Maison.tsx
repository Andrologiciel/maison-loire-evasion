/**
 * Direction « Carnet de terroir » : rendre les informations pratiques sensibles et
 * habitables, avec un rythme d’images et de texte rappelant un guide de séjour.
 */
import { Check, Coffee, Gamepad2, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout, { BookingButton } from "@/components/SiteLayout";

const comforts = [
  { icon: Utensils, title: "Une cuisine pour partager", text: "Four, lave-vaisselle, grand réfrigérateur, Airfryer et de nombreux appareils pour les repas qui s’étirent." },
  { icon: Gamepad2, title: "Un palier pour se détendre", text: "À l’étage, un espace détente et une borne d’arcade font le lien entre les générations." },
  { icon: ShieldCheck, title: "Un jardin en toute liberté", text: "Environ 700 m² de jardin arboré, entièrement clos, avec un espace pétanque pour jouer ou ne rien faire." },
  { icon: Coffee, title: "Un séjour bien commencé", text: "Lits faits, linge fourni et essentiels à disposition : l’arrivée se fait sans courir après les détails." },
];

const rooms = [
  "Deux chambres avec lit 160 × 200 et rangements.",
  "Une chambre avec lit double 140 × 190.",
  "Une chambre avec deux lits simples 90 × 190.",
  "Une salle de bain avec baignoire et douche, une salle d’eau avec double vasque.",
];

export default function Maison() {
  return (
    <SiteLayout>
      <PageHero
        index="01"
        kicker="La maison"
        title="Le confort d’une grande maison, l’âme d’une adresse de village."
        description="Une maison vigneronne généreuse, pensée pour huit voyageurs et les séjours qui rassemblent vraiment."
        image="/manus-storage/maison-exterieur_57eb8c38.jpg"
        imageAlt="Vue du jardin de la Maison Vigneronne"
      />

      <section id="contenu" className="intro-spread">
        <div className="intro-spread-text">
          <p className="eyebrow">L’art de recevoir</p>
          <h2>Faire de la place aux vacances.</h2>
          <p>
            Les beaux volumes de cette maison du XIX<sup>e</sup> siècle se prêtent aux grandes tablées, aux retours de balade et aux pauses silencieuses. Salon chaleureux, salle à manger conviviale et cuisine ouverte composent le rez-de-chaussée.
          </p>
          <p>
            La cour en gravier, côté cuisine, invite aux cafés du matin comme aux apéritifs d’été. De l’autre côté, le jardin clos prend le relais pour les enfants, les lecteurs et les joueurs de pétanque.
          </p>
        </div>
        <figure className="intro-spread-image">
          <img src="/manus-storage/maison-salle-a-manger_55bd9810.jpg" alt="Table dressée dans la salle à manger" />
          <figcaption>Des espaces conçus pour vivre ensemble.</figcaption>
        </figure>
      </section>

      <section className="comforts-section">
        <div className="section-heading compact">
          <p className="eyebrow">Les attentions de la maison</p>
          <h2>Tout est là, sans surenchère.</h2>
        </div>
        <div className="comforts-grid">
          {comforts.map(({ icon: Icon, title, text }, index) => (
            <article className="comfort-card" key={title}>
              <span className="comfort-index">0{index + 1}</span>
              <Icon size={26} strokeWidth={1.35} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sleep-section">
        <div className="sleep-image">
          <img src="/manus-storage/maison-terrasse_f42d2c07.jpg" alt="Coin terrasse de la maison" />
        </div>
        <div className="sleep-copy">
          <p className="eyebrow"><Sparkles size={14} /> Les nuits</p>
          <h2>Quatre chambres, pour respecter le rythme de chacun.</h2>
          <div className="rooms-list">
            {rooms.map((room) => <p key={room}><Check size={16} /> {room}</p>)}
          </div>
          <p className="small-note">Le linge de lit et les serviettes de toilette sont fournis pour simplifier votre arrivée.</p>
          <BookingButton />
        </div>
      </section>
    </SiteLayout>
  );
}

