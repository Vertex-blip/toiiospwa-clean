"use client";

import { ToastProvider } from "@/components/Toast";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Bell, ShieldCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function isActivePath(pathname, href) {
  if (href === "/menu/home" || href === "/vendor" || href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppShell({
  children,
  navItems,
  allowedRoles,
  title = "toi.kz",
  eyebrow = "Premium PWA",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, checking } = useRequireAuth({ allowedRoles });

  if (checking) {
    return (
      <div className="app-loader">
        <span className="spinner" />
      </div>
    );
  }

  const unreadCount = user?.role === "admin" ? 3 : 2;

  return (
    <ToastProvider>
      <div className="app-shell" style={{ "--nav-count": navItems.length }}>
        <aside className="app-sidebar" aria-label="Навигация">
          <button className="app-brand" type="button" onClick={() => router.push(navItems[0]?.href || "/menu/home")}>
            <img className="app-brand-logo" src="/images/toi-logo.png" alt="toi.kz" />
            <span>
              <strong>TOI.KZ</strong>
              <small>{eyebrow}</small>
            </span>
          </button>

          <nav className="app-side-nav">
            {navItems.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  className={`app-nav-link ${active ? "active" : ""}`}
                  type="button"
                  onClick={() => router.push(item.href)}
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge ? <em>{item.badge}</em> : null}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="app-main">
          <header className="app-topbar">
            <div>
              <p>{eyebrow}</p>
              <h1>{title}</h1>
            </div>
            <div className="app-topbar-actions">
              <button
                className="icon-action"
                type="button"
                aria-label="Уведомления"
                onClick={() =>
                  router.push(user?.role === "vendor" ? "/vendor/messages" : user?.role === "admin" ? "/admin/messages" : "/menu/profile")
                }
              >
                <Bell size={20} />
                {unreadCount ? <span>{unreadCount}</span> : null}
              </button>
              <div className="mini-profile">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>{user?.name || "toi.kz"}</span>
              </div>
            </div>
          </header>

          {children}
        </main>

        <nav className="app-bottom-nav" aria-label="Мобильная навигация">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                className={`bottom-nav-button ${active ? "active" : ""}`}
                type="button"
                onClick={() => router.push(item.href)}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge ? <em>{item.badge}</em> : null}
              </button>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
