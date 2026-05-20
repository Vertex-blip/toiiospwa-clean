"use client";
import { useEffect, useState, createContext, useContext } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ru"); // default

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_lang");
      if (saved) setLang(saved);
    } catch (e) {}
  }, []);

  const changeLang = (l) => {
    setLang(l);
    try {
      localStorage.setItem("app_lang", l);
    } catch (e) {}
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: "ru", changeLang: () => {} };
  return ctx;
}
