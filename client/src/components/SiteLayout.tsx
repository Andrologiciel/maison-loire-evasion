/**
 * Direction « Carnet de terroir » : repères de chemin ocre, typographie éditoriale,
 * hospitalité sereine. Cette structure relie la maison et le territoire.
 */
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { SiAirbnb, SiBookingdotcom } from "react-icons/si";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import SearchOverlay from "@/components/SearchOverlay";
import siteContent from "@/content/site.json";
import { customPages } from "@/lib/customPages";

const coreLinks = [
  { href: "/", label: siteContent.navigation.homeLabel },
  { href: "/chateaux", label: siteContent.navigation.castlesLabel },
  { href: "/autour-de-nous", label: siteContent.navigation.aroundLabel },
  { href: "/balades", label: siteContent.navigation.outdoorsLabel },
  { href: "/commerces-utiles", label: siteContent.navigation.usefulLabel },
  { href: "/idees-de-sejour", label: siteContent.navigation.staysLabel },
  { href: "/loisirs", label: siteContent.navigation.leisureLabel },
];

const customLinks = customPages
  .filter((page) => page.showInNavigation)
  .map((page) => ({ href: `/${page.slug}`, label: page.navigationLabel || page.title }));
const links = [...coreLinks, ...customLinks];

const headingFonts: Record<string, string> = {
  fraunces: '"Fraunces", Georgia, serif',
  cormorant: '"Cormorant Garamond", Georgia, serif',
  playfair: '"Playfair Display", Georgia, serif',
  baskerville: '"Libre Baskerville", Georgia, serif',
};

const bodyFonts: Record<string, string> = {
  "dm-sans": '"DM Sans", Arial, sans-serif',
  inter: '"Inter", Arial, sans-serif',
  lato: '"Lato", Arial, sans-serif',
  "open-sans": '"Open Sans", Arial, sans-serif',
  "source-sans": '"Source Sans 3", Arial, sans-serif',
};

const themePresets: Record<string, { primary: string; secondary: string; text: string; background: string }> = {
  current: { primary: "#b75d31", secondary: "#315444", text: "#21382f", background: "#f5f0e6" },
  winery: { primary: "#8b3a46", secondary: "#5d4934", text: "#302522", background: "#f6eee5" },
  loire: { primary: "#3f7f6c", secondary: "#58744d", text: "#243c35", background: "#f1f5ec" },
  chateau: { primary: "#9a762e", secondary: "#2f4665", text: "#252c38", background: "#f4f0e8" },
};

export function ReservationButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`reservation-buttons ${className}`}>
      <a
        className="reservation-button airbnb-button"
        href={siteContent.booking.airbnbUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Réserver la Maison Vigneronne sur Airbnb"
      >
        <SiAirbnb className="reservation-logo" aria-hidden="true" />
        <span>Airbnb</span>
        <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
      </a>
      <a
        className="reservation-button booking-com-button"
        href={siteContent.booking.bookingUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Réserver la Maison Vigneronne sur Booking.com"
      >
        <SiBookingdotcom className="reservation-logo" aria-hidden="true" />
        <span>Booking.com</span>
        <ArrowUpRight size={14} strokeWidth={2.2} aria-hidden="true" />
      </a>
    </div>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [location] = useLocation();

  const appearance = siteContent.appearance;
  const theme = siteContent.theme;
  const preset = themePresets[theme.themePreset] ?? themePresets.current;
  const colors = theme.customColors
    ? {
        primary: theme.primaryColor,
        secondary: theme.secondaryColor,
        text: theme.textColor,
        background: theme.backgroundColor,
      }
    : preset;
  const appearanceStyle = {
    "--font-heading": headingFonts[appearance.headingFont] ?? headingFonts.fraunces,
    "--font-body": bodyFonts[appearance.bodyFont] ?? bodyFonts["dm-sans"],
    "--site-primary": colors.primary,
    "--site-secondary": colors.secondary,
    "--site-text": colors.text,
    "--site-background": colors.background,
    "--custom-button-color": theme.buttonColor,
  } as CSSProperties;

  return (
    <div
      className={`site-shell theme-${theme.themePreset} body-size-${appearance.bodySize} heading-size-${appearance.headingSize} buttons-${theme.buttonStyle} button-shape-${theme.buttonShape} content-width-${theme.contentWidth} corners-${theme.cornerRadius}`}
      style={appearanceStyle}
    >
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Accueil La Maison Vigneronne">
            <img
              src={siteContent.identity.logo}
              alt="Symbole de La Maison Vigneronne"
              className="brand-mark"
            />
            <span className="brand-copy">
              <span>{siteContent.identity.brandLine1}</span>
              <strong>{siteContent.identity.brandLine2}</strong>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Navigation principale">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={location === link.href ? "nav-link active" : "nav-link"}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button type="button" className="header-search" onClick={() => setIsSearchOpen(true)} aria-label="Rechercher dans le site"><Search size={17} /></button>
          <ReservationButtons className="desktop-booking" />

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="mobile-panel">
            <nav aria-label="Navigation mobile" className="mobile-nav">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={location === link.href ? "mobile-link active" : "mobile-link"}
                  onClick={() => setIsOpen(false)}
                >
                  <span>0{index + 1}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
            <button type="button" className="mobile-search" onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}><Search size={16} /> Rechercher dans le site</button>
            <ReservationButtons className="mobile-booking" />
          </div>
        )}
      </header>

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-mark">
          <img src={siteContent.identity.logo} alt="" />
          <div>
            <p className="eyebrow">{siteContent.identity.location}</p>
            <p className="footer-title">{siteContent.identity.brandLine1} {siteContent.identity.brandLine2}</p>
          </div>
        </div>
        <div className="footer-copy">
          <p>{siteContent.footer.tagline}</p>
          <ReservationButtons className="footer-reservations" />
        </div>
        <p className="footer-note">
          {siteContent.footer.note}
        </p>
      </footer>
    </div>
  );
}
