"use client";

import AppShell from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";
import { Briefcase, CalendarDays, Home, MessageCircle, Settings, Star, User, WalletCards } from "lucide-react";

const navItems = [
  { href: "/vendor", label: "Главная", i18nKey: "vendorHome", icon: Home },
  { href: "/vendor/orders", label: "Заказы", i18nKey: "orders", icon: WalletCards, badge: 1 },
  { href: "/vendor/profile", label: "Профиль", i18nKey: "profile", icon: User },
  { href: "/vendor/services", label: "Услуги", i18nKey: "services", icon: Briefcase },
  { href: "/vendor/calendar", label: "Календарь", i18nKey: "calendar", icon: CalendarDays },
  { href: "/vendor/reviews", label: "Отзывы", i18nKey: "reviews", icon: Star },
  { href: "/vendor/messages", label: "Сообщения", i18nKey: "messages", icon: MessageCircle, badge: 2 },
  { href: "/vendor/settings", label: "Настройки", i18nKey: "settings", icon: Settings },
];

export default function VendorLayout({ children }) {
  const { lang } = useLanguage();
  return (
    <AppShell navItems={navItems} allowedRoles={["vendor", "admin"]} title={t("vendorTitle", lang)} eyebrow={t("vendorEyebrow", lang)}>
      {children}
    </AppShell>
  );
}
