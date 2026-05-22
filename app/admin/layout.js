"use client";

import AppShell from "@/components/AppShell";
import { useLanguage } from "@/components/LanguageContext";
import { t } from "@/lib/i18n";
import { AlertTriangle, BarChart3, Briefcase, Calendar, FileText, Home, MapPin, MessageCircle, Settings, Star, Tags, UserCog, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", i18nKey: "home", icon: Home },
  { href: "/admin/users", label: "Users", i18nKey: "users", icon: Users },
  { href: "/admin/vendors", label: "Vendors", i18nKey: "vendors", icon: Briefcase, badge: 1 },
  { href: "/admin/services", label: "Services", i18nKey: "services", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", i18nKey: "booking", icon: Calendar },
  { href: "/admin/categories", label: "Categories", i18nKey: "categories", icon: Tags },
  { href: "/admin/cities", label: "Cities", i18nKey: "cities", icon: MapPin },
  { href: "/admin/messages", label: "Messages", i18nKey: "messages", icon: MessageCircle, badge: 2 },
  { href: "/admin/reviews", label: "Reviews", i18nKey: "reviews", icon: Star },
  { href: "/admin/complaints", label: "Complaints", i18nKey: "complaints", icon: AlertTriangle, badge: 1 },
  { href: "/admin/content", label: "Content", i18nKey: "content", icon: UserCog },
  { href: "/admin/analytics", label: "Analytics", i18nKey: "analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", i18nKey: "settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { lang } = useLanguage();

  if (pathname === "/admin/login") return children;

  return (
    <AppShell navItems={navItems} allowedRoles={["admin"]} title={t("adminTitle", lang)} eyebrow={t("adminEyebrow", lang)}>
      {children}
    </AppShell>
  );
}
