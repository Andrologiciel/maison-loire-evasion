/**
 * Direction « Carnet de terroir » : héroïnes éditoriales asymétriques, surfaces minérales
 * et repères de lecture sobres pour faire ressentir le territoire avant l’information.
 */
import { ArrowDown } from "lucide-react";

type PageHeroProps = {
  kicker: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  index: string;
};

export default function PageHero({
  kicker,
  title,
  description,
  image,
  imageAlt,
  index,
}: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-copy">
        <p className="eyebrow">
          <span>{index}</span> {kicker}
        </p>
        <h1>{title}</h1>
        <p className="page-hero-description">{description}</p>
        <a className="scroll-hint" href="#contenu">
          Continuer <ArrowDown size={15} />
        </a>
      </div>
      <div className="page-hero-image-wrap">
        <img className="page-hero-image" src={image} alt={imageAlt} />
        <span className="image-caption">Le Val de Loire, au fil des saisons</span>
      </div>
    </section>
  );
}

