import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SiteLayout from "@/components/SiteLayout";
import { findCustomPage } from "@/lib/customPages";
import NotFound from "@/pages/NotFound";

export default function CustomPage({ slug }: { slug: string }) {
  const page = findCustomPage(slug);
  if (!page) return <NotFound />;

  return (
    <SiteLayout>
      <PageHero
        index="+"
        kicker={page.kicker}
        title={page.title}
        description={page.description}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
        imageCaption={page.heroCaption}
      />
      <div id="contenu" className="custom-page-sections">
        {page.sections.map((section, index) => (
          <section
            className={`custom-page-section ${section.image ? `with-image image-${section.imagePosition ?? "right"}` : "text-only"}`}
            key={`${section.title}-${index}`}
          >
            {section.image && (
              <img src={section.image} alt={section.imageAlt ?? ""} />
            )}
            <div>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h2>{section.title}</h2>
              {section.text.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.buttonLabel && section.buttonUrl && (
                <a className="underline-link" href={section.buttonUrl} target={section.buttonUrl.startsWith("http") ? "_blank" : undefined} rel={section.buttonUrl.startsWith("http") ? "noreferrer" : undefined}>
                  {section.buttonLabel} <ArrowUpRight size={15} />
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
