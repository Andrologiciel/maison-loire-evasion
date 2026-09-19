/**
 * Direction « Carnet de terroir » : les loisirs s’inscrivent dans une géographie de plaisir.
 * Les filtres facilitent le choix, les sources gardent les informations pratiques à jour.
 */
import { ArrowUpRight, Bike, Droplets, Leaf, PawPrint, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import content from "@/content/leisure.json";
import { contentIcon } from "@/lib/contentIcons";

type LeisureCategory = "all" | "eau" | "famille" | "nature" | "activites";
const filters: Array<{ id: LeisureCategory; label: string; icon: typeof Droplets }> = [{ id: "all", label: "Toutes les idées", icon: Sparkles }, { id: "eau", label: "Eau & baignade", icon: Droplets }, { id: "famille", label: "En famille", icon: PawPrint }, { id: "nature", label: "Nature", icon: Leaf }, { id: "activites", label: "Activités", icon: Bike }];

export default function Leisure() {
  const [activeFilter, setActiveFilter] = useState<LeisureCategory>("all");
  const visibleLeisure = useMemo(() => content.activities.filter((item) => activeFilter === "all" || item.categories.includes(activeFilter)), [activeFilter]);

  return (
    <SiteLayout>
      <PageHero {...content.hero} />
      <section id="contenu" className="leisure-intro"><div><p className="eyebrow"><Sparkles size={14} /> {content.intro.kicker}</p><h2>{content.intro.title}</h2></div><p>{content.intro.text}</p></section>
      <section className="leisure-filter-section"><p className="eyebrow">{content.filterLabel}</p><div className="leisure-filters">{filters.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={activeFilter === id ? "leisure-filter active" : "leisure-filter"} onClick={() => setActiveFilter(id)}><Icon size={15} /> {label}</button>)}</div></section>
      <section className="leisure-grid">{visibleLeisure.map(({ icon, tag, title, text, place, url }, index) => { const Icon = contentIcon(icon); return <article className={index === 0 ? "leisure-card featured" : "leisure-card"} key={title}><div className="leisure-card-stop"><span>Étape<br />0{index + 1}</span><Icon size={index === 0 ? 42 : 25} strokeWidth={1.25} /></div><div className="leisure-card-copy"><p className="leisure-tag">{tag}</p><h2>{title}</h2><p>{text}</p><div><span>{place}</span><a href={url} target="_blank" rel="noreferrer">Préparer la sortie <ArrowUpRight size={15} /></a></div></div></article>;})}</section>
      <section className="leisure-note"><Droplets size={21} /><p>{content.note}</p></section>
    </SiteLayout>
  );
}
