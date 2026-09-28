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
import englishSiteContent from "@/content/site.en.json";
import { customPages, customPagesEn } from "@/lib/customPages";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { text } = useLanguage();
  return (
    <div className={`reservation-buttons ${className}`}>
      <a
        className="reservation-button airbnb-button"
        href={siteContent.booking.airbnbUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={text.bookAirbnb}
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
        aria-label={text.bookBooking}
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
  const { language, text, localizedPath, switchLanguage } = useLanguage();
  const translatedSite = language === "en" ? englishSiteContent : siteContent;
  const coreLinks = [
    { href: localizedPath("/"), label: translatedSite.navigation.homeLabel },
    { href: localizedPath("/chateaux"), label: translatedSite.navigation.castlesLabel },
    { href: localizedPath("/autour-de-nous"), label: translatedSite.navigation.aroundLabel },
    { href: localizedPath("/balades"), label: translatedSite.navigation.outdoorsLabel },
    { href: localizedPath("/commerces-utiles"), label: translatedSite.navigation.usefulLabel },
    { href: localizedPath("/idees-de-sejour"), label: translatedSite.navigation.staysLabel },
    { href: localizedPath("/loisirs"), label: translatedSite.navigation.leisureLabel },
  ];
  const activeCustomPages = language === "en" ? customPagesEn : customPages;
  const customLinks = activeCustomPages
    .filter((page) => page.showInNavigation)
    .map((page) => ({ href: localizedPath(`/${page.slug}`), label: page.navigationLabel || page.title }));
  const links = [...coreLinks, ...customLinks];

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
          <Link href={localizedPath("/")} className="brand" aria-label={text.home}>
            <img
              src={siteContent.identity.logo}
              alt={language === "en" ? "La Maison Vigneronne symbol" : "Symbole de La Maison Vigneronne"}
              className="brand-mark"
            />
            <span className="brand-copy">
              <span>{translatedSite.identity.brandLine1}</span>
              <strong>{translatedSite.identity.brandLine2}</strong>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label={text.mainNavigation}>
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

          <button type="button" className="header-search" onClick={() => setIsSearchOpen(true)} aria-label={text.search}><Search size={17} /></button>
          <div className="language-switcher" role="group" aria-label={language === "en" ? "Choose language" : "Choisir la langue"}>
            <button type="button" className={language === "fr" ? "active" : ""} onClick={() => switchLanguage("fr")} aria-label={text.switchFrench} aria-pressed={language === "fr"}><span aria-hidden="true">🇫🇷</span><span className="language-code">FR</span></button>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => switchLanguage("en")} aria-label={text.switchEnglish} aria-pressed={language === "en"}><span aria-hidden="true">🇬🇧</span><span className="language-code">EN</span></button>
          </div>
          <ReservationButtons className="desktop-booking" />

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isOpen}
            aria-label={isOpen ? text.closeMenu : text.openMenu}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="mobile-panel">
            <nav aria-label={text.mobileNavigation} className="mobile-nav">
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
            <button type="button" className="mobile-search" onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}><Search size={16} /> {text.search}</button>
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
            <p className="eyebrow">{translatedSite.identity.location}</p>
            <p className="footer-title">{translatedSite.identity.brandLine1} {translatedSite.identity.brandLine2}</p>
          </div>
        </div>
        <div className="footer-copy">
          <p>{translatedSite.footer.tagline}</p>
          <ReservationButtons className="footer-reservations" />
        </div>
        <p className="footer-note">
          {translatedSite.footer.note}
        </p>
      </footer>
    </div>
  );
}
