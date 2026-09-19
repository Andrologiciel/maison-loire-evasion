/**
 * Direction « Carnet de terroir » : une page pratique pensée comme une marge de carnet.
 * La clarté prévaut, avec des sources affichées et des accès actualisés aux recherches locales.
 */
import { ArrowUpRight, ExternalLink, MapPinned, Phone } from "lucide-react";
import UsefulPlacesMap from "@/components/UsefulPlacesMap";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import content from "@/content/useful.json";
import { contentIcon } from "@/lib/contentIcons";
import type { UsefulPoint } from "@/components/UsefulPlacesMap";

export default function Useful() {
  return (
    <SiteLayout>
      <PageHero {...content.hero} />

      <section id="contenu" className="useful-intro">
        <div><p className="eyebrow"><MapPinned size={14} /> {content.intro.kicker}</p><h2>{content.intro.title}</h2></div>
        <p>{content.intro.text}</p>
      </section>

      <UsefulPlacesMap kicker={content.map.kicker} title={content.map.title} text={content.map.text} places={content.map.points as UsefulPoint[]} />

      <section className="live-search-section">
        <div className="live-search-heading"><p className="eyebrow">{content.searches.kicker}</p><h2>{content.searches.title}</h2></div>
        <div className="live-search-grid">
          {content.searches.items.map(({ icon, title, text, url }) => { const Icon = contentIcon(icon); return (
            <a key={title} className="live-search-card" href={url} target="_blank" rel="noreferrer"><Icon size={23} strokeWidth={1.4} /><h3>{title}</h3><p>{text}</p><span>Ouvrir la carte <ArrowUpRight size={15} /></span></a>
          );})}
        </div>
      </section>

      <section className="essential-list-section">
        <div className="essential-list-title"><p className="eyebrow">{content.essentials.kicker}</p><h2>{content.essentials.title}</h2><p>{content.essentials.introduction}</p></div>
        <div className="essential-list">
          {content.essentials.items.map(({ icon, type, title, text, url, source }, index) => { const Icon = contentIcon(icon); return (
            <article className="essential-row" key={title}><span className="essential-index">0{index + 1}</span><Icon size={24} strokeWidth={1.35} /><div><p className="essential-type">{type}</p><h3>{title}</h3><p>{text}</p></div><a href={url} target="_blank" rel="noreferrer">{source} <ExternalLink size={14} /></a></article>
          );})}
        </div>
      </section>

      <section className="emergency-banner">
        <div className="emergency-icon"><Phone size={24} /></div>
        <div><p className="eyebrow">{content.emergency.kicker}</p><h2>{content.emergency.title}</h2></div>
        <p>{content.emergency.text}</p>
        <a href={`tel:${content.emergency.phone}`}>{content.emergency.buttonLabel} <ArrowUpRight size={16} /></a>
      </section>
    </SiteLayout>
  );
}
