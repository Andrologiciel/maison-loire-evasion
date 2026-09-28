/**
 * Direction « Carnet de terroir » : les activités de plein air sont traitées comme
 * des invitations à partir doucement, avec des données pratiques et des liens sources clairs.
 */
import { ArrowUpRight, Bike, Footprints, Route, ShieldAlert } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import frenchContent from "@/content/outdoors.json";
import englishContent from "@/content/outdoors.en.json";
import type { MapPoint } from "@/components/InteractiveMap";
import { useLocalizedContent } from "@/lib/useLocalizedContent";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Outdoors() {
  const content = useLocalizedContent(frenchContent, englishContent);
  const { language } = useLanguage();
  return (
    <SiteLayout>
      <PageHero {...content.hero} />

      <section id="contenu" className="outdoors-intro">
        <div><p className="eyebrow">{content.intro.kicker}</p><h2>{content.intro.title}</h2></div>
        <p>{content.intro.text}</p>
      </section>

      <InteractiveMap kicker={content.map.kicker} title={content.map.title} text={content.map.text} points={content.map.points as MapPoint[]} />

      <section className="outdoor-split">
        <div className="activity-side cycling-side">
          <div className="activity-label"><Bike size={23} /><span>{content.cycling.title}</span></div>
          <p className="activity-intro">{content.cycling.introduction}</p>
          <div className="activity-list">
            {content.cycling.items.map((item, index) => (
              <article key={item.title}>
                <span>0{index + 1}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <a href={item.url} target="_blank" rel="noreferrer" aria-label={`${language === "en" ? "View route" : "Consulter l’itinéraire"} ${item.title}`}><ArrowUpRight size={17} /></a>
              </article>
            ))}
          </div>
          <a className="section-external" href={content.cycling.officialUrl} target="_blank" rel="noreferrer">{content.cycling.officialLabel} <ArrowUpRight size={16} /></a>
        </div>
        <div className="outdoor-photo">
          <img src={content.cycling.image} alt={content.cycling.imageAlt} />
          <p>{content.cycling.imageCaption}</p>
        </div>
      </section>

      <section className="walking-section">
        <div className="walking-title"><Footprints size={25} strokeWidth={1.4} /><p className="eyebrow">{content.walking.kicker}</p><h2>{content.walking.title}</h2></div>
        <div className="walking-list">
          {content.walking.items.map((item) => (
            <article className="walk-row" key={item.title}>
              <Route size={20} strokeWidth={1.45} />
              <div><p className="walk-details">{item.details}</p><h3>{item.title}</h3><p>{item.text}</p></div>
              <a href={item.url} target="_blank" rel="noreferrer">{language === "en" ? "Route details" : "Fiche & tracé"} <ArrowUpRight size={15} /></a>
            </article>
          ))}
        </div>
      </section>

      <section className="safety-note">
        <ShieldAlert size={21} strokeWidth={1.55} />
        <p>{content.safety}</p>
      </section>
    </SiteLayout>
  );
}
