/**
 * Direction « Carnet de terroir » : la page privilégie le sentiment de proximité
 * et les détails concrets, comme une page de carnet qui se prête à la table du petit-déjeuner.
 */
import { ArrowUpRight, CircleDotDashed, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import content from "@/content/around.json";
import { contentIcon } from "@/lib/contentIcons";

export default function Around() {
  return (
    <SiteLayout>
      <PageHero {...content.hero} />

      <section id="contenu" className="radius-section">
        <div className="radius-graphic">
          <div className="radius-rings"><span>{content.radius.distance}</span></div>
          <p><MapPin size={14} /> {content.radius.location}</p>
        </div>
        <div className="radius-copy">
          <p className="eyebrow">{content.radius.kicker}</p>
          <h2>{content.radius.title}</h2>
          <p>{content.radius.text}</p>
        </div>
      </section>

      <section className="nearby-grid">
        {content.nearby.map(({ icon, title, place, text, url }, index) => {
          const Icon = contentIcon(icon);
          return (
          <article className="nearby-card" key={title}>
            <div className="nearby-top"><span>0{index + 1}</span><Icon size={24} strokeWidth={1.35} /></div>
            <p className="nearby-place">{place}</p>
            <h3>{title}</h3>
            <p>{text}</p>
            <a href={url} target="_blank" rel="noreferrer">En savoir plus <ArrowUpRight size={15} /></a>
          </article>
        );})}
      </section>

      <section className="day-idea">
        <div className="day-idea-image">
          <img src={content.dayIdea.image} alt={content.dayIdea.imageAlt} />
        </div>
        <div className="day-idea-copy">
          <p className="eyebrow"><CircleDotDashed size={14} /> {content.dayIdea.kicker}</p>
          <h2>{content.dayIdea.title}</h2>
          <p>{content.dayIdea.text}</p>
        </div>
      </section>
    </SiteLayout>
  );
}
