/**
 * Direction « Carnet de terroir » : repères de chemin ocre, typographie éditoriale,
 * hospitalité sereine. Cette structure relie la maison et le territoire.
 */
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";

const bookingHref =
  "https://www.airbnb.fr/rooms/1699452930737491401?guests=1&adults=1&s=67&unique_share_id=b01cc512-b461-47f1-b82d-398ff4faddf4";

const links = [
  { href: "/", label: "La maison" },
  { href: "/chateaux", label: "Les châteaux" },
  { href: "/autour-de-nous", label: "À 30 km" },
  { href: "/balades", label: "À pied & à vélo" },
  { href: "/commerces-utiles", label: "Commerces utiles" },
];

export function BookingButton({ className = "" }: { className?: string }) {
  return (
    <a
      className={`booking-button ${className}`}
      href={bookingHref}
      target="_blank"
      rel="noreferrer"
    >
      Voir les disponibilités <ArrowUpRight size={15} strokeWidth={2.2} />
    </a>
  );
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
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

          <BookingButton className="desktop-booking" />

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
            <BookingButton className="mobile-booking" />
          </div>
        )}
      </header>

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
          <a href={bookingHref} target="_blank" rel="noreferrer">
            Réserver votre séjour <ArrowUpRight size={14} />
          </a>
        </div>
        <p className="footer-note">
          Les parcours et horaires évoluent : consultez les sites officiels avant votre visite.
        </p>
      </footer>
    </div>
  );
}
