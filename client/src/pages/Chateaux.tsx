/**
 * Direction « Carnet de terroir » : proposer une carte sensible du patrimoine, en
 * alternant grandes destinations et domaines plus confidentiels sans ton promotionnel.
 */
import { ArrowUpRight, Castle, Footprints, Navigation, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import content from "@/content/chateaux.json";

export default function Chateaux() {
  return (
    <SiteLayout>
      <PageHero {...content.hero} />

      <section id="contenu" className="castle-intro">
        <div className="castle-intro-stamp"><Castle size={30} strokeWidth={1.2} /><span>{content.intro.stamp}</span></div>
        <div>
          <p className="eyebrow">{content.intro.kicker}</p>
          <h2>{content.intro.title}</h2>
        </div>
        <p>{content.intro.text}</p>
      </section>

      <section className="castle-list">
        {content.castles.map((castle, index) => (
          <article className={`castle-entry ${castle.accent}`} key={castle.title}>
            <div className="castle-sequence">0{index + 1}</div>
            <div className="castle-meta">
              <p>{castle.tag}</p>
              <strong>{castle.distance}</strong>
            </div>
            <div className="castle-body">
              <h3>{castle.title}</h3>
              <p>{castle.text}</p>
            </div>
            <a href={castle.url} target="_blank" rel="noreferrer" className="castle-external">
              {castle.linkLabel} <ArrowUpRight size={17} />
            </a>
          </article>
        ))}
      </section>

      <section className="heritage-note">
        <div className="heritage-icon"><Footprints size={23} /><Navigation size={18} /></div>
        <div>
          <p className="eyebrow">{content.note.kicker}</p>
          <h2>{content.note.title}</h2>
        </div>
        <p>{content.note.text}</p>
        <a href={content.note.link} className="heritage-link">{content.note.linkLabel} <ArrowUpRight size={16} /></a>
      </section>
    </SiteLayout>
  );
}
