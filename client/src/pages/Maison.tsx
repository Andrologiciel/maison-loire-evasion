/**
 * Direction « Carnet de terroir » : rendre les informations pratiques sensibles et
 * habitables, avec un rythme d’images et de texte rappelant un guide de séjour.
 */
import { Check, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout, { ReservationButtons } from "@/components/SiteLayout";
import content from "@/content/maison.json";
import { contentIcon } from "@/lib/contentIcons";

export default function Maison() {
  return (
    <SiteLayout>
      <PageHero
        {...content.hero}
      />

      <section id="contenu" className="intro-spread">
        <div className="intro-spread-text">
          <p className="eyebrow">{content.intro.kicker}</p>
          <h2>{content.intro.title}</h2>
          {content.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <figure className="intro-spread-image">
          <img src={content.intro.image} alt={content.intro.imageAlt} />
          <figcaption>{content.intro.imageCaption}</figcaption>
        </figure>
      </section>

      <section className="comforts-section">
        <div className="section-heading compact">
          <p className="eyebrow">{content.comforts.kicker}</p>
          <h2>{content.comforts.title}</h2>
        </div>
        <div className="comforts-grid">
          {content.comforts.items.map(({ icon, title, text }, index) => {
            const Icon = contentIcon(icon);
            return (
            <article className="comfort-card" key={title}>
              <span className="comfort-index">0{index + 1}</span>
              <Icon size={26} strokeWidth={1.35} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          );})}
        </div>
      </section>

      <section className="sleep-section">
        <div className="sleep-image">
          <img src={content.sleep.image} alt={content.sleep.imageAlt} />
        </div>
        <div className="sleep-copy">
          <p className="eyebrow"><Sparkles size={14} /> {content.sleep.kicker}</p>
          <h2>{content.sleep.title}</h2>
          <div className="rooms-list">
            {content.sleep.rooms.map((room) => <p key={room}><Check size={16} /> {room}</p>)}
          </div>
          <p className="small-note">{content.sleep.note}</p>
          <ReservationButtons />
        </div>
      </section>
    </SiteLayout>
  );
}
