/**
 * Direction « Carnet de terroir » : des séjours conçus comme des chemins souples.
 * Chaque proposition ménage autant de temps pour voir que pour ralentir.
 */
import { ArrowRight, CalendarDays, Coffee, Compass, Heart, Leaf, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";

type Duration = "all" | "weekend" | "3jours" | "semaine" | "2semaines" | "long";
type Mood = "all" | "repos" | "detente" | "visites" | "famille" | "nature" | "velo";

const durationFilters: Array<{ id: Duration; label: string }> = [{ id: "all", label: "Toutes les durées" }, { id: "weekend", label: "Week-end" }, { id: "3jours", label: "3 jours" }, { id: "semaine", label: "Une semaine" }, { id: "2semaines", label: "Deux semaines" }, { id: "long", label: "3 semaines et +" }];
const moodFilters: Array<{ id: Mood; label: string; icon: typeof Heart }> = [{ id: "all", label: "Toutes les envies", icon: Compass }, { id: "repos", label: "Repos", icon: Coffee }, { id: "detente", label: "Détente", icon: Sparkles }, { id: "visites", label: "Visites", icon: CalendarDays }, { id: "famille", label: "En famille", icon: Heart }, { id: "nature", label: "Nature", icon: Leaf }, { id: "velo", label: "À vélo", icon: Compass }];

const stays = [
  { number: "01", duration: ["weekend"], moods: ["repos", "detente", "visites"], time: "48 heures", title: "Un week-end pour souffler", lead: "Deux jours pour quitter le rythme quotidien sans cocher trop de cases.", steps: ["Arrivée douce, promenade dans le bourg et dîner à la maison.", "Cheverny à pied le matin, jardin et apéritif au soleil l’après-midi.", "Un marché, un bon petit-déjeuner, puis le chemin du retour sans se presser."], image: "/manus-storage/maison-salon_4bae837c.jpg", imageAlt: "Salon chaleureux de la maison" },
  { number: "02", duration: ["3jours"], moods: ["visites", "velo", "detente"], time: "3 jours", title: "Patrimoine, vignes et jardin", lead: "La formule idéale pour associer les grands noms de la Loire et quelques respirations choisies.", steps: ["Cheverny à pied : intérieurs, jardins et retour au calme.", "Chambord à vélo ou en voiture, avec un temps libre pour le parc.", "Blois, une dégustation de vins de Cheverny et une dernière soirée dans la cour."], image: "/manus-storage/loire-chateaux-hero_5bfaf079.jpg", imageAlt: "Château de la Loire au milieu de son parc" },
  { number: "03", duration: ["semaine"], moods: ["famille", "nature", "visites"], time: "Une semaine", title: "Une semaine qui alterne tout", lead: "Des sorties fortes, des journées lentes et assez de temps pour que chacun y trouve son rythme.", steps: ["Deux châteaux choisis à votre cadence : Cheverny et Chambord ou Blois.", "Une journée de loisirs : Beauval, baignade ou canoë selon la saison.", "Des boucles à vélo, des chemins de Sologne et deux après-midis sans programme."], image: "/manus-storage/loire-walking-route_678e2fa2.jpg", imageAlt: "Sentier de promenade en Sologne" },
  { number: "04", duration: ["2semaines"], moods: ["nature", "velo", "detente", "famille"], time: "Deux semaines", title: "Le luxe de ne rien précipiter", lead: "Un séjour pour explorer la Loire, le Cher et la Sologne en gardant toujours la maison comme refuge.", steps: ["Des journées de châteaux espacées par des haltes de village et de vignoble.", "Une sortie sur l’eau, une journée Beauval et une baignade lorsque la météo s’y prête.", "Des itinéraires à vélo et à pied, avec du temps réservé aux repas et au jardin."], image: "/manus-storage/loire-cycling-route_eca40887.jpg", imageAlt: "Cyclistes sur une route paisible de la Loire" },
  { number: "05", duration: ["long"], moods: ["repos", "detente", "nature", "visites", "velo"], time: "Trois semaines et plus", title: "Habiter la Loire, un temps", lead: "Pour installer une routine heureuse : marchés, vignes, balades et découvertes au fil des envies du jour.", steps: ["Donnez une place aux grandes visites, mais aussi aux paysages traversés entre deux étapes.", "Explorez plus loin vers la vallée du Cher, les villages et les forêts de Sologne.", "Laissez les journées sans objectif devenir les plus beaux souvenirs du séjour."], image: "/manus-storage/loire-vineyard-hero_0ede957b.jpg", imageAlt: "Vignes et chemin du Val de Loire" },
];

export default function Stays() {
  const [duration, setDuration] = useState<Duration>("all");
  const [mood, setMood] = useState<Mood>("all");
  const visibleStays = useMemo(() => stays.filter((stay) => (duration === "all" || stay.duration.includes(duration)) && (mood === "all" || stay.moods.includes(mood))), [duration, mood]);

  return (
    <SiteLayout>
      <PageHero index="06" kicker="Idées de séjour" title="Un séjour à composer, jamais à remplir." description="Du week-end improvisé aux vacances qui s’installent, choisissez une durée et une envie ; la Loire s’occupe du reste." image="/manus-storage/loire-vineyard-hero_0ede957b.jpg" imageAlt="Paysage viticole du Val de Loire" />
      <section id="contenu" className="stays-intro"><div><p className="eyebrow"><Compass size={14} /> Votre rythme avant tout</p><h2>Voir beaucoup, ou juste assez.</h2></div><p>Ces suggestions donnent une direction, pas un emploi du temps. Gardez toujours une marge pour un repas qui s’étire, une sieste sous les arbres ou une découverte glanée en chemin.</p></section>
      <section className="stay-filter-section"><div className="filter-heading"><p className="eyebrow">Choisir votre séjour</p><p>Affinez par durée et par envie.</p></div><div className="stay-filter-row" role="group" aria-label="Filtrer par durée">{durationFilters.map((item) => <button key={item.id} type="button" className={duration === item.id ? "stay-filter active" : "stay-filter"} onClick={() => setDuration(item.id)}>{item.label}</button>)}</div><div className="stay-filter-row mood-row" role="group" aria-label="Filtrer par envie">{moodFilters.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={mood === id ? "stay-filter mood active" : "stay-filter mood"} onClick={() => setMood(id)}><Icon size={14} /> {label}</button>)}</div></section>
      <section className="stay-list">{visibleStays.map((stay) => <article className="stay-entry" key={stay.number}><div className="stay-number"><span>{stay.number}</span><i /></div><div className="stay-image"><img src={stay.image} alt={stay.imageAlt} /><p>{stay.time}</p></div><div className="stay-copy"><p className="eyebrow">{stay.time}</p><h2>{stay.title}</h2><p className="stay-lead">{stay.lead}</p><ol>{stay.steps.map((step) => <li key={step}>{step}</li>)}</ol><Link href="/loisirs" className="arrow-link">Explorer les loisirs <ArrowRight size={17} /></Link></div></article>)}</section>
      {visibleStays.length === 0 && <section className="stay-empty"><p className="eyebrow">Aucune formule exacte</p><h2>Élargissez une envie ou une durée pour découvrir nos suggestions.</h2><button type="button" onClick={() => { setDuration("all"); setMood("all"); }}>Réinitialiser les filtres</button></section>}
    </SiteLayout>
  );
}

