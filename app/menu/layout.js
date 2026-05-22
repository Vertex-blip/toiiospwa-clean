"use client";

import AppShell from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";
import { CalendarCheck, Home, Info, Search, User, WalletCards } from "lucide-react";

const navItems = [
  { href: "/menu/home", label: "Главная", i18nKey: "home", icon: Home },
  { href: "/menu/halls", label: "Каталог", i18nKey: "catalog", icon: Search },
  { href: "/menu/plan", label: "План", i18nKey: "plan", icon: WalletCards },
  { href: "/menu/booking", label: "Бронь", i18nKey: "booking", icon: CalendarCheck },
  { href: "/menu/about", label: "О нас", i18nKey: "about", icon: Info },
  { href: "/menu/profile", label: "Профиль", i18nKey: "profile", icon: User },
];

export default function MenuLayout({ children }) {
  const { lang } = useLanguage();
  return (
    <AppShell navItems={navItems} allowedRoles={["client", "admin"]} title={t("clientTitle", lang)} eyebrow={t("clientEyebrow", lang)}>
      {children}
    </AppShell>
  );
}
