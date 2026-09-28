import { useLanguage } from "@/contexts/LanguageContext";

export function useLocalizedContent<T>(french: T, english: unknown): T {
  const { language } = useLanguage();
  return (language === "en" ? english : french) as T;
}
