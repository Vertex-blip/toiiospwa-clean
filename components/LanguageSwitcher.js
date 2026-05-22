"use client";

import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";

export default function LanguageSwitcher({ compact = false }) {
  const { lang, changeLang, languages } = useLanguage();

  return (
    <div className={compact ? "language-switcher compact" : "language-switcher"} aria-label={t("language", lang)}>
      {languages.map((item) => (
        <button
          key={item.code}
          type="button"
          className={lang === item.code ? "active" : ""}
          onClick={() => changeLang(item.code)}
          aria-pressed={lang === item.code}
        >
          {compact ? item.short : item.label}
        </button>
      ))}
    </div>
  );
}
