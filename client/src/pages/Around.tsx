/**
 * Direction « Carnet de terroir » : la page privilégie le sentiment de proximité
 * et les détails concrets, comme une page de carnet qui se prête à la table du petit-déjeuner.
 */
import { ArrowUpRight, CircleDotDashed, Compass, Grape, MapPin, Soup, Trees } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";

const nearby = [
  { icon: Grape, title: "L’appellation Cour-Cheverny", place: "Dans le village", text: "Prenez le temps d’un arrêt dans l’un des domaines et à la Maison des vins de Cheverny pour découvrir les vins du secteur, dont le cépage romorantin.", href: "https://www.val-de-loire-41.com/degustation/maison-des-vins-de-cheverny-degcen0410001691/" },
  { icon: Trees, title: "Les domaines et jardins", place: "Cheverny · Cellettes · Tour-en-Sologne", text: "Beauregard, Villesavin et les paysages de Sologne composent une journée plus tranquille, entre architecture, sous-bois et petites routes.", href: "https://www.val-de-loire-41.com/incontournables/chateau-cheverny/sejourner/que-faire-autour/" },
  { icon: Compass, title: "Blois, côté ville", place: "Environ 15 min", text: "Pour les ruelles anciennes, le château royal, les quais de Loire et l’animation d’un centre historique à découvrir sans programme trop serré.", href: "https://www.bloischambord.com/" },
  { icon: Soup, title: "Les saveurs locales", place: "À quelques pas", text: "Boulangerie, épicerie, marché hebdomadaire le vendredi, cafés et restaurants : le bourg permet de faire simple et de rester tout près.", href: "https://www.bloischambord.com/visites-et-activites/le-patrimoine/cour-cheverny-cour-cheverny-fr-1538130/" },
];

export default function Around() {
  return (
    <SiteLayout>
      <PageHero
        index="03"
        kicker="Curiosités à moins de 30 km"
        title="Ne cherchez pas loin. Le séjour est déjà tout autour."
        description="Entre vignes, villages, patrimoine et tables de terroir, Cour-Cheverny est une invitation à composer des journées sans longs trajets."
        image="/manus-storage/loire-vineyard-hero_0ede957b.jpg"
        imageAlt="Chemin au milieu des vignes de la Loire"
      />

      <section id="contenu" className="radius-section">
        <div className="radius-graphic">
          <div className="radius-rings"><span>30<br />km</span></div>
          <p><MapPin size={14} /> Maison Vigneronne<br /><strong>Cour-Cheverny</strong></p>
        </div>
        <div className="radius-copy">
          <p className="eyebrow">Le cercle des belles idées</p>
          <h2>Une adresse qui laisse plus de temps pour ce que vous aimez faire.</h2>
          <p>Les repères ci-dessous sont proposés pour vous inspirer. Les distances restent indicatives et dépendent de l’itinéraire choisi ; ouvrez les liens pour préparer votre visite du jour.</p>
        </div>
      </section>

      <section className="nearby-grid">
        {nearby.map(({ icon: Icon, title, place, text, href }, index) => (
          <article className="nearby-card" key={title}>
            <div className="nearby-top"><span>0{index + 1}</span><Icon size={24} strokeWidth={1.35} /></div>
            <p className="nearby-place">{place}</p>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href={href} target="_blank" rel="noreferrer">En savoir plus <ArrowUpRight size={15} /></a>
          </article>
        ))}
      </section>

      <section className="day-idea">
        <div className="day-idea-image">
          <img src="/manus-storage/maison-facade_71465e76.jpg" alt="Détail de la façade de la maison" />
        </div>
        <div className="day-idea-copy">
          <p className="eyebrow"><CircleDotDashed size={14} /> Une journée idéale</p>
          <h2>Un château le matin, un verre chez les vignerons, le jardin l’après-midi.</h2>
          <p>La beauté de Cour-Cheverny tient aussi dans cette facilité : alterner grands sites, moments gourmands et pauses à la maison sans transformer les vacances en emploi du temps.</p>
        </div>
      </section>
    </SiteLayout>
  );
}

