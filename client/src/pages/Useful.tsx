/**
 * Direction « Carnet de terroir » : une page pratique pensée comme une marge de carnet.
 * La clarté prévaut, avec des sources affichées et des accès actualisés aux recherches locales.
 */
import { ArrowUpRight, Building2, Cross, ExternalLink, HeartPulse, Hospital, MapPinned, Phone, ShoppingBag, Store } from "lucide-react";
import UsefulPlacesMap from "@/components/UsefulPlacesMap";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";

const liveSearches = [
  { icon: ShoppingBag, title: "Tous les commerces", copy: "Recherche actualisée autour de Cour-Cheverny.", href: "https://www.google.com/maps/search/commerces/@47.5103,1.4569,12z" },
  { icon: Store, title: "Alimentation & supermarchés", copy: "Épiceries, marchés, boulangeries et grandes surfaces.", href: "https://www.google.com/maps/search/alimentation+supermarch%C3%A9/@47.5103,1.4569,12z" },
  { icon: Cross, title: "Pharmacies", copy: "Pharmacies de proximité et informations actualisées.", href: "https://www.google.com/maps/search/pharmacie/@47.5103,1.4569,12z" },
  { icon: HeartPulse, title: "Santé & soins", copy: "Professionnels, maisons de santé et établissements de soins.", href: "https://www.google.com/maps/search/etablissement+de+sante/@47.5103,1.4569,12z" },
];

const nearbyEssentials = [
  { icon: Store, type: "Le quotidien", title: "Les commerces du bourg", text: "Boulangerie, cafés, tabac-presse, banque et autres commerces de proximité sont accessibles dans le centre de Cour-Cheverny. La mairie actualise son annuaire économique local.", href: "https://mairie-cour-cheverny.fr/vie-economique/", source: "Annuaire de la mairie" },
  { icon: Cross, type: "Santé", title: "Pharmacie Lebegue-Ribault", text: "10 place Victor-Hugo, 41700 Cour-Cheverny. Téléphone : 02 54 79 96 04. Vérifiez les horaires et les services avant tout déplacement.", href: "https://www.sante.fr/pharmacie-dofficine/cour-cheverny/pharmacie-lebegue-ribault", source: "Santé.fr" },
  { icon: Building2, type: "Santé", title: "Maison de Santé Universitaire", text: "36 route de Romorantin, 41700 Cheverny. Accueil : 02 54 79 96 80. Les modalités de prise en charge et les disponibilités sont à confirmer auprès de la structure.", href: "https://mairie-cheverny.com/vie-pratique/numeros-utiles/", source: "Mairie de Cheverny" },
  { icon: Hospital, type: "Établissement hospitalier", title: "Centre Hospitalier Simone Veil", text: "Mail Pierre Charlot, 41000 Blois. Standard : 02 54 55 66 33. L’établissement propose de nombreux services de soins et un accueil d’urgence.", href: "https://ch-blois.com/", source: "Centre Hospitalier Simone Veil" },
];

export default function Useful() {
  return (
    <SiteLayout>
      <PageHero
        index="05"
        kicker="Commerces et lieux utiles"
        title="Le bon service, quand il vous le faut."
        description="Repères de proximité, santé et services essentiels autour de Cour-Cheverny, pour profiter du séjour l’esprit plus léger."
        image="/manus-storage/maison-terrasse_f42d2c07.jpg"
        imageAlt="Cour extérieure de la Maison Vigneronne"
      />

      <section id="contenu" className="useful-intro">
        <div><p className="eyebrow"><MapPinned size={14} /> Bien s’orienter</p><h2>Une adresse de village, des services tout autour.</h2></div>
        <p>Les repères ci-dessous privilégient les informations publiées par les structures officielles. Parce que commerces, horaires et disponibilités évoluent, les recherches ouvertes permettent d’explorer les résultats les plus récents dans un rayon d’environ 30 km.</p>
      </section>

      <UsefulPlacesMap />

      <section className="live-search-section">
        <div className="live-search-heading"><p className="eyebrow">Explorer en temps réel</p><h2>Trouver l’adresse la plus adaptée, au moment où vous en avez besoin.</h2></div>
        <div className="live-search-grid">
          {liveSearches.map(({ icon: Icon, title, copy, href }) => (
            <a key={title} className="live-search-card" href={href} target="_blank" rel="noreferrer"><Icon size={23} strokeWidth={1.4} /><h3>{title}</h3><p>{copy}</p><span>Ouvrir la carte <ArrowUpRight size={15} /></span></a>
          ))}
        </div>
      </section>

      <section className="essential-list-section">
        <div className="essential-list-title"><p className="eyebrow">Repères vérifiés</p><h2>Les premières adresses à garder en tête.</h2><p>Les fiches renvoient vers l’organisme qui publie l’information. Confirmez toujours l’ouverture, le service disponible et les conditions de prise en charge avant de vous déplacer.</p></div>
        <div className="essential-list">
          {nearbyEssentials.map(({ icon: Icon, type, title, text, href, source }, index) => (
            <article className="essential-row" key={title}><span className="essential-index">0{index + 1}</span><Icon size={24} strokeWidth={1.35} /><div><p className="essential-type">{type}</p><h3>{title}</h3><p>{text}</p></div><a href={href} target="_blank" rel="noreferrer">{source} <ExternalLink size={14} /></a></article>
          ))}
        </div>
      </section>

      <section className="emergency-banner">
        <div className="emergency-icon"><Phone size={24} /></div>
        <div><p className="eyebrow">En cas d’urgence</p><h2>Pour une urgence vitale, appelez le 15.</h2></div>
        <p>Le Centre Hospitalier Simone Veil de Blois rappelle ce numéro d’urgence. Pour une information non urgente, privilégiez les contacts des structures et les annuaires officiels ci-dessus.</p>
        <a href="tel:15">Appeler le 15 <ArrowUpRight size={16} /></a>
      </section>
    </SiteLayout>
  );
}

