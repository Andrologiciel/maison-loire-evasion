/**
 * Direction « Carnet de terroir » : les activités de plein air sont traitées comme
 * des invitations à partir doucement, avec des données pratiques et des liens sources clairs.
 */
import { ArrowUpRight, Bike, Footprints, Route, ShieldAlert } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";

const cycling = [
  { title: "Ombres & Lumières", copy: "Une boucle qui relie Cour-Cheverny, ses vignobles et Tour-en-Sologne, avec une halte possible au château de Villesavin.", href: "https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" },
  { title: "Entre Vignobles & Châteaux", copy: "Une invitation à passer par Cellettes, Chitenay et Cheverny, au fil des paysages viticoles et de petits domaines patrimoniaux.", href: "https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" },
  { title: "Au Royaume du Cerf", copy: "Une sortie vers les paysages typiques de Sologne, avec Cheverny et Fontaines-en-Sologne parmi les étapes signalées par l’Office de Tourisme.", href: "https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" },
];

const walks = [
  { title: "Cour-Cheverny – Jouvançay", details: "Boucle facile · 9,4 km · env. 2 h 40", copy: "Un itinéraire balisé par la FFRandonnée 41, au départ de la salle des fêtes de Cour-Cheverny, entre patrimoine de village et chemins des environs.", href: "https://www.bloischambord.com/visites-et-activites/balades-et-visites/rando-cour-cheverny-jouvancay-cour-cheverny-fr-5395609/" },
  { title: "Les Bruyères de Sérigny", details: "Boucle facile · 12,8 km · env. 3 h 40", copy: "Une sortie plus longue pour respirer la Sologne, à ouvrir avec la fiche de parcours avant le départ.", href: "https://www.bloischambord.com/en/tours-and-activities/walks-and-visits/les-bruyeres-de-serigny-de-cour-cherverny-cour-cheverny-en-5395608/" },
  { title: "Le circuit du Château", details: "Boucle · 17,8 km", copy: "Une randonnée au départ de Cheverny pour associer village, paysage et découverte du territoire à son propre rythme.", href: "https://www.bloischambord.com/visites-et-activites/balades-et-visites/le-circuit-du-chateau-a-cheverny-cheverny-fr-5395591/" },
];

export default function Outdoors() {
  return (
    <SiteLayout>
      <PageHero
        index="04"
        kicker="À pied & à vélo"
        title="Le plaisir de suivre les chemins plutôt que l’horloge."
        description="Des pistes cyclables paisibles, des boucles balisées et les chemins de Sologne : les alentours s’explorent sans chercher la performance."
        image="/manus-storage/loire-cycling-route_eca40887.jpg"
        imageAlt="Cyclistes sur une route paisible du Val de Loire"
      />

      <section id="contenu" className="outdoors-intro">
        <div><p className="eyebrow">Le bon départ</p><h2>Les itinéraires prennent la forme d’une promenade.</h2></div>
        <p>La maison se trouve à proximité des pistes cyclables et du balisage local. Pour une trace, un équipement ou les conditions actualisées, les liens renvoient directement aux pages des offices de tourisme.</p>
      </section>

      <section className="outdoor-split">
        <div className="activity-side cycling-side">
          <div className="activity-label"><Bike size={23} /><span>Les boucles à vélo</span></div>
          <p className="activity-intro">Une façon douce de rejoindre châteaux, vignes et villages, en gardant le paysage à hauteur de regard.</p>
          <div className="activity-list">
            {cycling.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <div><h3>{item.title}</h3><p>{item.copy}</p></div>
                <a href={item.href} target="_blank" rel="noreferrer" aria-label={`Consulter l'itinéraire ${item.title}`}><ArrowUpRight size={17} /></a>
              </article>
            ))}
          </div>
          <a className="section-external" href="https://bloischambord.com/decouvrir-la-destination/chateaux-de-la-loire-a-velo/les-parcours/autour-de-cheverny/" target="_blank" rel="noreferrer">Voir les parcours officiels <ArrowUpRight size={16} /></a>
        </div>
        <div className="outdoor-photo">
          <img src="/manus-storage/loire-walking-route_678e2fa2.jpg" alt="Sentier dans les bois de Sologne" />
          <p>Les chemins sablonneux de Sologne.</p>
        </div>
      </section>

      <section className="walking-section">
        <div className="walking-title"><Footprints size={25} strokeWidth={1.4} /><p className="eyebrow">Les randonnées à pied</p><h2>Partir de Cour-Cheverny, revenir avec l’envie de recommencer.</h2></div>
        <div className="walking-list">
          {walks.map((item) => (
            <article className="walk-row" key={item.title}>
              <Route size={20} strokeWidth={1.45} />
              <div><p className="walk-details">{item.details}</p><h3>{item.title}</h3><p>{item.copy}</p></div>
              <a href={item.href} target="_blank" rel="noreferrer">Fiche & tracé <ArrowUpRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="safety-note">
        <ShieldAlert size={21} strokeWidth={1.55} />
        <p><strong>Avant de partir :</strong> prévoyez eau, tenue adaptée et batterie chargée. Vérifiez le balisage, les conditions météo et les éventuelles mises à jour de parcours auprès de l’Office de Tourisme.</p>
      </section>
    </SiteLayout>
  );
}

