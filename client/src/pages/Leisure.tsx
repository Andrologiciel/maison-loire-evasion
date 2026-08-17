/**
 * Direction « Carnet de terroir » : les loisirs s’inscrivent dans une géographie de plaisir.
 * Les filtres facilitent le choix, les sources gardent les informations pratiques à jour.
 */
import { ArrowUpRight, Bike, Droplets, Leaf, PawPrint, ShipWheel, Sparkles, Trees } from "lucide-react";
import { useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";

type LeisureCategory = "all" | "eau" | "famille" | "nature" | "activites";
const filters: Array<{ id: LeisureCategory; label: string; icon: typeof Droplets }> = [{ id: "all", label: "Toutes les idées", icon: Sparkles }, { id: "eau", label: "Eau & baignade", icon: Droplets }, { id: "famille", label: "En famille", icon: PawPrint }, { id: "nature", label: "Nature", icon: Leaf }, { id: "activites", label: "Activités", icon: Bike }];

const leisure = [
  { category: ["famille", "activites"], icon: PawPrint, tag: "Une grande journée", title: "ZooParc de Beauval", copy: "Une journée à consacrer à la découverte des animaux, des territoires et des animations. Le site officiel recommande de préparer les billets et les horaires en amont.", place: "Saint-Aignan-sur-Cher", href: "https://www.zoobeauval.com/", image: "/manus-storage/loire-walking-route_678e2fa2.jpg" },
  { category: ["eau", "famille", "nature"], icon: Droplets, tag: "Pour se rafraîchir", title: "Baignade naturelle du Grand Chambord", copy: "Une idée de pause estivale du côté de Mont-près-Chambord. Vérifiez les périodes d’ouverture et les conditions d’accès sur la fiche officielle avant le départ.", place: "Mont-près-Chambord", href: "https://www.val-de-loire-41.com/activite/baignade-naturelle-du-grand-chambord-loicen0410004538/", image: "/manus-storage/loire-vineyard-hero_0ede957b.jpg" },
  { category: ["eau", "famille"], icon: Droplets, tag: "Bassin & jeux d’eau", title: "Centre aquatique Grand Chambord", copy: "Une alternative tout indiquée quand on cherche une parenthèse aquatique. Les créneaux et équipements évoluent : consultez la fiche avant de partir.", place: "Saint-Laurent-Nouan", href: "https://www.val-de-loire-41.com/activite/centre-aquatique-grand-chambord-loicen041v500eki/", image: "/manus-storage/maison-terrasse_f42d2c07.jpg" },
  { category: ["eau", "nature", "activites"], icon: ShipWheel, tag: "Sur le Cher", title: "Aventure canoë sur le Cher", copy: "Des parcours sur le Cher, au départ notamment de Chissay, Chisseaux et Montrichard, jusqu’aux abords de Chenonceau selon les formules proposées.", place: "Vallée du Cher", href: "https://www.val-de-loire-41.com/activite/aventure-canoe-sur-le-cher-asc41aaact100936/", image: "/manus-storage/loire-cycling-route_eca40887.jpg" },
  { category: ["nature", "activites", "famille"], icon: Trees, tag: "Au rythme du cheval", title: "Écurie de la Colinière", copy: "Sorties à cheval ou en attelage, initiations et activités de pleine nature pour découvrir autrement les paysages autour de Cheverny.", place: "Cheverny", href: "https://www.valdeloire-france.com/activite/centre-de-tourisme-equestre-ecurie-de-la-coliniere/", image: "/manus-storage/loire-walking-route_678e2fa2.jpg" },
  { category: ["famille", "nature"], icon: Leaf, tag: "Tout près des animaux", title: "Balades avec les ânes", copy: "Une autre manière de marcher et de partager le paysage, proposée dans la sélection famille du tourisme du Loir-et-Cher.", place: "À découvrir dans le Loir-et-Cher", href: "https://www.val-de-loire-41.com/activite/les-anes-de-madame-balades-et-randonnees-pedestres-avec-un-ane-asccen0410003393/", image: "/manus-storage/loire-vineyard-hero_0ede957b.jpg" },
];

export default function Leisure() {
  const [activeFilter, setActiveFilter] = useState<LeisureCategory>("all");
  const visibleLeisure = useMemo(() => leisure.filter((item) => activeFilter === "all" || item.category.includes(activeFilter)), [activeFilter]);

  return (
    <SiteLayout>
      <PageHero index="07" kicker="Loisirs & activités" title="Mettre les pieds dans l’eau, la tête dehors et le temps de son côté." description="Des journées avec les enfants, des sorties nature et des idées pour bouger ou se rafraîchir autour de la maison." image="/manus-storage/loire-cycling-route_eca40887.jpg" imageAlt="Balade à vélo dans les paysages de Loire" />
      <section id="contenu" className="leisure-intro"><div><p className="eyebrow"><Sparkles size={14} /> Les plaisirs du dehors</p><h2>Une journée qui ressemble à vos vacances.</h2></div><p>Les idées ci-dessous sont à choisir selon la saison, l’âge des voyageurs et l’envie du jour. Les liens mènent vers les prestataires ou organismes qui publient les conditions à jour.</p></section>
      <section className="leisure-filter-section"><p className="eyebrow">Choisir une ambiance</p><div className="leisure-filters">{filters.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={activeFilter === id ? "leisure-filter active" : "leisure-filter"} onClick={() => setActiveFilter(id)}><Icon size={15} /> {label}</button>)}</div></section>
      <section className="leisure-grid">{visibleLeisure.map(({ icon: Icon, tag, title, copy, place, href }, index) => <article className={index === 0 ? "leisure-card featured" : "leisure-card"} key={title}><div className="leisure-card-stop"><span>Étape<br />0{index + 1}</span><Icon size={index === 0 ? 42 : 25} strokeWidth={1.25} /></div><div className="leisure-card-copy"><p className="leisure-tag">{tag}</p><h2>{title}</h2><p>{copy}</p><div><span>{place}</span><a href={href} target="_blank" rel="noreferrer">Préparer la sortie <ArrowUpRight size={15} /></a></div></div></article>)}</section>
      <section className="leisure-note"><Droplets size={21} /><p><strong>Avant de partir :</strong> pour les activités d’eau, vérifiez météo, niveaux, réservations et consignes de sécurité. Pour les sites de loisirs, consultez leurs conditions d’accès et horaires du jour.</p></section>
    </SiteLayout>
  );
}
