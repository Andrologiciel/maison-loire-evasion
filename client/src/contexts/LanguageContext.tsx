import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";

export type Language = "fr" | "en";

const ui = {
  fr: {
    home: "Accueil La Maison Vigneronne",
    mainNavigation: "Navigation principale",
    mobileNavigation: "Navigation mobile",
    search: "Rechercher dans le site",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    bookAirbnb: "Réserver la Maison Vigneronne sur Airbnb",
    bookBooking: "Réserver la Maison Vigneronne sur Booking.com",
    switchFrench: "Afficher le site en français",
    switchEnglish: "Display the website in English",
  },
  en: {
    home: "La Maison Vigneronne home page",
    mainNavigation: "Main navigation",
    mobileNavigation: "Mobile navigation",
    search: "Search the website",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    bookAirbnb: "Book La Maison Vigneronne on Airbnb",
    bookBooking: "Book La Maison Vigneronne on Booking.com",
    switchFrench: "Afficher le site en français",
    switchEnglish: "Display the website in English",
  },
} as const;

type LanguageContextValue = {
  language: Language;
  text: (typeof ui)[Language];
  localizedPath: (path: string, targetLanguage?: Language) => string;
  switchLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function stripLanguagePrefix(path: string) {
  if (path === "/en") return "/";
  return path.startsWith("/en/") ? path.slice(3) || "/" : path;
}

export function pathForLanguage(path: string, language: Language) {
  const basePath = stripLanguagePrefix(path);
  if (language === "fr") return basePath;
  return basePath === "/" ? "/en" : `/en${basePath}`;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const language: Language = location === "/en" || location.startsWith("/en/") ? "en" : "fr";

  useEffect(() => {
    if (location !== "/") return;
    const savedLanguage = localStorage.getItem("site-language");
    const browserLanguage = navigator.language.toLowerCase();
    if (!savedLanguage && browserLanguage.startsWith("en")) {
      setLocation("/en", { replace: true });
    }
  }, [location, setLocation]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("site-language", language);
    document.cookie = `site-language=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [language]);

  function localizedPath(path: string, targetLanguage = language) {
    return pathForLanguage(path, targetLanguage);
  }

  function switchLanguage(nextLanguage: Language) {
    setLocation(pathForLanguage(location, nextLanguage));
  }

  return (
    <LanguageContext.Provider value={{ language, text: ui[language], localizedPath, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
