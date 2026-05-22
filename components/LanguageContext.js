"use client";
import { useEffect, useState, createContext, useContext } from "react";
import { DEFAULT_LANG, LANGUAGES, normalizeLang } from "@/lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(DEFAULT_LANG);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_lang");
      if (saved) setLang(normalizeLang(saved));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const changeLang = (l) => {
    const next = normalizeLang(l);
    setLang(next);
    try {
      localStorage.setItem("app_lang", next);
    } catch (e) {}
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: DEFAULT_LANG, changeLang: () => {}, languages: LANGUAGES };
  return ctx;
}
