/**
 * Direction « Carnet de terroir » : des séjours conçus comme des chemins souples.
 * Chaque proposition ménage autant de temps pour voir que pour ralentir.
 */
import { ArrowRight, CalendarDays, Coffee, Compass, Heart, Leaf, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import content from "@/content/stays.json";

type Duration = "all" | "weekend" | "3jours" | "semaine" | "2semaines" | "long";
type Mood = "all" | "repos" | "detente" | "visites" | "famille" | "nature" | "velo";

const durationFilters: Array<{ id: Duration; label: string }> = [{ id: "all", label: "Toutes les durées" }, { id: "weekend", label: "Week-end" }, { id: "3jours", label: "3 jours" }, { id: "semaine", label: "Une semaine" }, { id: "2semaines", label: "Deux semaines" }, { id: "long", label: "3 semaines et +" }];
const moodFilters: Array<{ id: Mood; label: string; icon: typeof Heart }> = [{ id: "all", label: "Toutes les envies", icon: Compass }, { id: "repos", label: "Repos", icon: Coffee }, { id: "detente", label: "Détente", icon: Sparkles }, { id: "visites", label: "Visites", icon: CalendarDays }, { id: "famille", label: "En famille", icon: Heart }, { id: "nature", label: "Nature", icon: Leaf }, { id: "velo", label: "À vélo", icon: Compass }];

export default function Stays() {
  const [duration, setDuration] = useState<Duration>("all");
  const [mood, setMood] = useState<Mood>("all");
  const visibleStays = useMemo(() => content.stays.filter((stay) => (duration === "all" || stay.duration.includes(duration)) && (mood === "all" || stay.moods.includes(mood))), [duration, mood]);

  return (
    <SiteLayout>
      <PageHero {...content.hero} />
      <section id="contenu" className="stays-intro"><div><p className="eyebrow"><Compass size={14} /> {content.intro.kicker}</p><h2>{content.intro.title}</h2></div><p>{content.intro.text}</p></section>
      <section className="stay-filter-section"><div className="filter-heading"><p className="eyebrow">{content.filter.kicker}</p><p>{content.filter.text}</p></div><div className="stay-filter-row" role="group" aria-label="Filtrer par durée">{durationFilters.map((item) => <button key={item.id} type="button" className={duration === item.id ? "stay-filter active" : "stay-filter"} onClick={() => setDuration(item.id)}>{item.label}</button>)}</div><div className="stay-filter-row mood-row" role="group" aria-label="Filtrer par envie">{moodFilters.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={mood === id ? "stay-filter mood active" : "stay-filter mood"} onClick={() => setMood(id)}><Icon size={14} /> {label}</button>)}</div></section>
      <section className="stay-list">{visibleStays.map((stay, index) => <article className="stay-entry" key={stay.title}><div className="stay-number"><span>{String(index + 1).padStart(2, "0")}</span><i /></div><div className="stay-image"><img src={stay.image} alt={stay.imageAlt} /><p>{stay.time}</p></div><div className="stay-copy"><p className="eyebrow">{stay.time}</p><h2>{stay.title}</h2><p className="stay-lead">{stay.lead}</p><ol>{stay.steps.map((step) => <li key={step}>{step}</li>)}</ol><Link href="/loisirs" className="arrow-link">Explorer les loisirs <ArrowRight size={17} /></Link></div></article>)}</section>
      {visibleStays.length === 0 && <section className="stay-empty"><p className="eyebrow">{content.empty.kicker}</p><h2>{content.empty.title}</h2><button type="button" onClick={() => { setDuration("all"); setMood("all"); }}>{content.empty.buttonLabel}</button></section>}
    </SiteLayout>
  );
}
