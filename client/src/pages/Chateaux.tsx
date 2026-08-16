/**
 * Direction « Carnet de terroir » : proposer une carte sensible du patrimoine, en
 * alternant grandes destinations et domaines plus confidentiels sans ton promotionnel.
 */
import { ArrowUpRight, Castle, Footprints, Navigation, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";

const castles = [
  {
    tag: "À pied",
    distance: "10 min à pied",
    title: "Cheverny",
    copy: "Un château familial vivant, habité par la même famille depuis plus de six siècles. Intérieurs, jardins et univers de Moulinsart en font une première visite particulièrement fluide en famille.",
    href: "https://www.chateau-cheverny.fr/",
    accent: "terre",
  },
  {
    tag: "À vélo ou en voiture",
    distance: "45 min à vélo · 20 min en voiture",
    title: "Chambord",
    copy: "Une journée pour changer d’échelle : le château, le parc et les terrasses. Prenez le temps de monter l’escalier à double révolution et de regarder le paysage depuis les hauteurs.",
    href: "https://www.chambord.org/",
    accent: "moss",
  },
  {
    tag: "À découvrir",
    distance: "Dans les environs",
    title: "Blois & son château royal",
    copy: "Un centre historique à parcourir à pied, des façades qui traversent les siècles et une belle idée de programme lorsque l’on veut mêler ville, patrimoine et terrasse de café.",
    href: "https://www.chateaudeblois.fr/",
    accent: "ink",
  },
  {
    tag: "Un peu plus secret",
    distance: "Aux portes de Cheverny",
    title: "Beauregard, Villesavin & Troussay",
    copy: "Trois manières de quitter les itinéraires les plus évidents : galerie de portraits à Beauregard, élégance Renaissance à Villesavin et charme intimiste de Troussay au milieu des vignes.",
    href: "https://www.val-de-loire-41.com/incontournables/chateau-cheverny/sejourner/que-faire-autour/",
    accent: "sand",
  },
];

export default function Chateaux() {
  return (
    <SiteLayout>
      <PageHero
        index="02"
        kicker="Les châteaux de la Loire"
        title="De la grande histoire aux adresses que l’on se partage."
        description="Depuis Cour-Cheverny, les châteaux ne sont pas une course : ce sont des rendez-vous à choisir selon votre envie du jour."
        image="/manus-storage/loire-chateaux-hero_5bfaf079.jpg"
        imageAlt="Vue éditoriale d'un château de la Loire et de son parc"
      />

      <section id="contenu" className="castle-intro">
        <div className="castle-intro-stamp"><Castle size={30} strokeWidth={1.2} /><span>À partir<br />de Cour-<br />Cheverny</span></div>
        <div>
          <p className="eyebrow">Un territoire à plusieurs tempos</p>
          <h2>Une matinée à Cheverny. Une journée à Chambord. Une parenthèse à Blois.</h2>
        </div>
        <p>
          La maison offre une position rare : assez proche pour rejoindre Cheverny à pied, assez centrale pour combiner le majestueux et le plus confidentiel. Les horaires, jours d’ouverture et modalités de visite varient : vérifiez-les toujours sur le site du domaine avant de partir.
        </p>
      </section>

      <section className="castle-list">
        {castles.map((castle, index) => (
          <article className={`castle-entry ${castle.accent}`} key={castle.title}>
            <div className="castle-sequence">0{index + 1}</div>
            <div className="castle-meta">
              <p>{castle.tag}</p>
              <strong>{castle.distance}</strong>
            </div>
            <div className="castle-body">
              <h3>{castle.title}</h3>
              <p>{castle.copy}</p>
            </div>
            <a href={castle.href} target="_blank" rel="noreferrer" className="castle-external">
              Préparer la visite <ArrowUpRight size={17} />
            </a>
          </article>
        ))}
      </section>

      <section className="heritage-note">
        <div className="heritage-icon"><Footprints size={23} /><Navigation size={18} /></div>
        <div>
          <p className="eyebrow">Un conseil de rythme</p>
          <h2>Choisissez un château, puis laissez de la place au reste.</h2>
        </div>
        <p>Le jardin, un marché de village, une dégustation ou une boucle à vélo donnent souvent au séjour sa meilleure respiration.</p>
        <a href="/balades" className="heritage-link">Voir les itinéraires <ArrowUpRight size={16} /></a>
      </section>
    </SiteLayout>
  );
}

