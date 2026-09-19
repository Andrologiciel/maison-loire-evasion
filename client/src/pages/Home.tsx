/**
 * Direction « Carnet de terroir » : la vraie maison reste centrale, mise en scène par
 * une promenade éditoriale, chaleureuse et asymétrique qui relie séjour et territoire.
 */
import {
  ArrowRight,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";
import SiteLayout, { ReservationButtons } from "@/components/SiteLayout";
import content from "@/content/home.json";
import { contentIcon } from "@/lib/contentIcons";

export default function Home() {
  return (
    <SiteLayout>
      <section className="home-hero">
        <div className="hero-intro">
          <p className="eyebrow"><span>{content.hero.postalCode}</span> {content.hero.location}</p>
          <h1>{content.hero.title}</h1>
          <p className="hero-lead">{content.hero.introduction}</p>
          <div className="hero-actions">
            <ReservationButtons />
            <a className="text-link" href="#maison">{content.hero.discoveryLabel} <ArrowRight size={16} /></a>
          </div>
          <p className="hero-mini-note">{content.hero.note}</p>
        </div>

        <div className="hero-photo-stack" aria-label="Aperçu de la maison">
          <img
            className="hero-photo-main"
            src={content.hero.mainImage}
            alt={content.hero.mainImageAlt}
          />
          <figure className="hero-vignette">
            <img
              src={content.hero.vignetteImage}
              alt={content.hero.vignetteImageAlt}
            />
            <figcaption>{content.hero.vignetteCaption}</figcaption>
          </figure>
          <div className="hero-stamp">
            <span>{content.hero.badgeLine1}<br />{content.hero.badgeLine2}<br />{content.hero.badgeLine3}</span>
          </div>
        </div>
      </section>

      <section id="maison" className="amenities-band">
        <p className="eyebrow">{content.amenitiesLabel}</p>
        <div className="amenities-grid">
          {content.amenities.map(({ icon, value, label }) => {
            const Icon = contentIcon(icon);
            return (
            <div className="amenity" key={label}>
              <Icon size={18} strokeWidth={1.7} />
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          );})}
        </div>
      </section>

      <section className="story-section">
        <div className="story-aside">
          <p className="vertical-note">{content.story.verticalNote}</p>
          <div className="story-marker"><span>01</span></div>
        </div>
        <div className="story-image">
          <img src={content.story.image} alt={content.story.imageAlt} />
        </div>
        <div className="story-copy">
          <p className="eyebrow">{content.story.kicker}</p>
          <h2>{content.story.title}</h2>
          {content.story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link href="/maison" className="arrow-link">{content.story.linkLabel} <ChevronRight size={18} /></Link>
        </div>
      </section>

      <section className="portrait-grid-section">
        <div className="portrait-image tall-image">
          <img src={content.territory.largeImage} alt={content.territory.largeImageAlt} />
          <p>{content.territory.largeImageCaption}</p>
        </div>
        <div className="territory-manifesto">
          <p className="eyebrow"><MapPin size={14} /> {content.territory.kicker}</p>
          <h2>{content.territory.title}</h2>
          <p>{content.territory.text}</p>
          <Link className="underline-link" href="/autour-de-nous">{content.territory.linkLabel}</Link>
        </div>
        <div className="portrait-image small-image">
          <img src={content.territory.smallImage} alt={content.territory.smallImageAlt} />
        </div>
      </section>

      <section className="route-section">
        <div className="route-heading">
          <p className="eyebrow">{content.routes.kicker}</p>
          <h2>{content.routes.title}</h2>
          <p>{content.routes.introduction}</p>
        </div>
        <div className="route-list">
          {content.routes.items.map(({ to, icon, title, text }, index) => {
            const Icon = contentIcon(icon);
            return (<Link href={to} className="route-item" key={to}>
              <span className="route-number">{String(index + 1).padStart(2, "0")}</span>
              <Icon className="route-icon" size={25} strokeWidth={1.5} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <ArrowRight className="route-arrow" size={20} />
            </Link>);
          })}
        </div>
      </section>

      <section className="home-cta">
        <img src={content.cta.image} alt={content.cta.imageAlt} />
        <div className="home-cta-overlay" />
        <div className="home-cta-copy">
          <p className="eyebrow">{content.cta.kicker}</p>
          <h2>{content.cta.title}</h2>
          <ReservationButtons />
        </div>
      </section>
    </SiteLayout>
  );
}
