"use client";

import AppShell from "@/components/AppShell";
import { CalendarCheck, Home, Search, User, WalletCards } from "lucide-react";

const navItems = [
  { href: "/menu/home", label: "Главная", icon: Home },
  { href: "/menu/halls", label: "Каталог", icon: Search },
  { href: "/menu/plan", label: "План", icon: WalletCards },
  { href: "/menu/booking", label: "Бронь", icon: CalendarCheck },
  { href: "/menu/profile", label: "Профиль", icon: User },
];

export default function MenuLayout({ children }) {
  return (
    <AppShell navItems={navItems} allowedRoles={["client", "admin"]} title="Client app" eyebrow="toi.kz organizer">
      {children}
    </AppShell>
  );
}
