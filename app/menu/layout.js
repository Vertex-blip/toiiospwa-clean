"use client";

import AppShell from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";
import {
  Bell,
  CalendarCheck,
  Clock,
  Home,
  Info,
  Mail,
  Map,
  Search,
  Send,
  Table2,
  User,
  Users,
  WalletCards,
} from "lucide-react";

const navItems = [
  { href: "/menu/home", label: "Басты", i18nKey: "home", icon: Home },
  { href: "/menu/catalog", label: "Каталог", i18nKey: "catalog", icon: Search },
  { href: "/menu/map", label: "Карта", i18nKey: "map", icon: Map },
  { href: "/menu/booking", label: "Бронь", i18nKey: "booking", icon: CalendarCheck },
  { href: "/menu/plan", label: "Жоспар", i18nKey: "plan", icon: WalletCards },
  { href: "/menu/budget", label: "Бюджет", i18nKey: "budget", icon: WalletCards },
  { href: "/menu/guests", label: "Қонақтар", i18nKey: "guests", icon: Users },
  { href: "/menu/tables", label: "Үстелдер", i18nKey: "tables", icon: Table2 },
  { href: "/menu/invitations", label: "Шақыру", i18nKey: "invitations", icon: Send },
  { href: "/menu/timeline", label: "Timeline", i18nKey: "timeline", icon: Clock },
  { href: "/menu/notifications", label: "Хабарлама", i18nKey: "notifications", icon: Bell, badge: 2 },
  { href: "/menu/messages", label: "Чат", i18nKey: "messages", icon: Mail, badge: 1 },
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
