import { ArrowLeft, Castle, Grape, House } from "lucide-react";
import { Link } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { language, localizedPath } = useLanguage();
  const english = language === "en";

  return (
    <SiteLayout>
      <section className="not-found-page">
        <div className="not-found-landscape" aria-hidden="true">
          <span className="not-found-sun" />
          <span className="not-found-line line-one" />
          <span className="not-found-line line-two" />
          <Castle className="not-found-castle" strokeWidth={1.15} />
          <Grape className="not-found-grape" strokeWidth={1.15} />
        </div>
        <div className="not-found-copy">
          <p className="eyebrow">{english ? "A small detour" : "Un petit détour"}</p>
          <p className="not-found-number">404</p>
          <h1>{english ? "This path leads nowhere… for now." : "Ce chemin ne mène nulle part… pour le moment."}</h1>
          <p>{english ? "The page may have moved or disappeared. Let us take you back to La Maison Vigneronne and the Loire Valley." : "La page a peut-être été déplacée ou supprimée. Revenons à La Maison Vigneronne et aux chemins de la Loire."}</p>
          <Link href={localizedPath("/")} className="not-found-home">
            <ArrowLeft size={17} />
            <House size={17} />
            {english ? "Return home" : "Retourner à l’accueil"}
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
