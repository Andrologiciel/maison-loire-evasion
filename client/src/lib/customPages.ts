export type CustomSection = {
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right" | "full";
  buttonLabel?: string;
  buttonUrl?: string;
};

export type CustomPageContent = {
  title: string;
  slug: string;
  navigationLabel: string;
  navigationOrder: number;
  showInNavigation: boolean;
  kicker: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  heroCaption?: string;
  sections: CustomSection[];
};

const modules = import.meta.glob<{ default: CustomPageContent }>("../content/pages/*.json", {
  eager: true,
});

export const customPages = Object.values(modules)
  .map((module) => module.default)
  .filter((page) => page?.slug)
  .sort((a, b) => (a.navigationOrder ?? 100) - (b.navigationOrder ?? 100));

export function findCustomPage(slug: string) {
  return customPages.find((page) => page.slug === slug);
}
