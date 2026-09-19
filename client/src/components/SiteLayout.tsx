/**
 * Direction « Carnet de terroir » : repères de chemin ocre, typographie éditoriale,
 * hospitalité sereine. Cette structure relie la maison et le territoire.
 */
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { SiAirbnb, SiBookingdotcom } from "react-icons/si";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import SearchOverlay from "@/components/SearchOverlay";
import siteContent from "@/content/site.json";

const links = [
  { href: "/", label: "La maison" },
  { href: "/chateaux", label: "Les châteaux" },
  { href: "/autour-de-nous", label: "À 30 km" },
  { href: "/balades", label: "À pied & à vélo" },
  { href: "/commerces-utiles", label: "Commerces utiles" },
  { href: "/idees-de-sejour", label: "Idées de séjour" },
  { href: "/loisirs", label: "Loisirs" },
];

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

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Accueil La Maison Vigneronne">
            <img
              src="/manus-storage/maison-vigneronne-logo_8cd94448.png"
              alt="Symbole de La Maison Vigneronne"
              className="brand-mark"
            />
            <span className="brand-copy">
              <span>La Maison</span>
              <strong>Vigneronne</strong>
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
          <img src="/manus-storage/maison-vigneronne-logo_8cd94448.png" alt="" />
          <div>
            <p className="eyebrow">Cour-Cheverny · Val de Loire</p>
            <p className="footer-title">La Maison Vigneronne</p>
          </div>
        </div>
        <div className="footer-copy">
          <p>Une maison de caractère, au cœur des vignes et des châteaux.</p>
          <ReservationButtons className="footer-reservations" />
        </div>
        <p className="footer-note">
          Les parcours et horaires évoluent : consultez les sites officiels avant votre visite.
        </p>
      </footer>
    </div>
  );
}
