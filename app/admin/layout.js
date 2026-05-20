"use client";

import AppShell from "@/components/AppShell";
import { AlertTriangle, BarChart3, Briefcase, Calendar, FileText, Home, MapPin, MessageCircle, Settings, Star, Tags, UserCog, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/vendors", label: "Vendors", icon: Briefcase, badge: 1 },
  { href: "/admin/services", label: "Services", icon: FileText },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/cities", label: "Cities", icon: MapPin },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/complaints", label: "Complaints", icon: AlertTriangle, badge: 1 },
  { href: "/admin/content", label: "Content", icon: UserCog },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return children;

  return (
    <AppShell navItems={navItems} allowedRoles={["admin"]} title="Admin panel" eyebrow="toi.kz operations">
      {children}
    </AppShell>
  );
}
