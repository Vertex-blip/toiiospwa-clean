"use client";

import AppShell from "@/components/AppShell";
import { Briefcase, CalendarDays, Home, MessageCircle, Settings, Star, User, WalletCards } from "lucide-react";

const navItems = [
  { href: "/vendor", label: "Главная", icon: Home },
  { href: "/vendor/orders", label: "Заказы", icon: WalletCards, badge: 1 },
  { href: "/vendor/profile", label: "Профиль", icon: User },
  { href: "/vendor/services", label: "Услуги", icon: Briefcase },
  { href: "/vendor/calendar", label: "Календарь", icon: CalendarDays },
  { href: "/vendor/reviews", label: "Отзывы", icon: Star },
  { href: "/vendor/messages", label: "Сообщения", icon: MessageCircle, badge: 2 },
  { href: "/vendor/settings", label: "Настройки", icon: Settings },
];

export default function VendorLayout({ children }) {
  return (
    <AppShell navItems={navItems} allowedRoles={["vendor", "admin"]} title="Vendor cabinet" eyebrow="toi.kz business">
      {children}
    </AppShell>
  );
}
