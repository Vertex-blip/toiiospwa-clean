export const SESSION_KEY = "toi-auth-session";

export const ROLE_ROUTES = {
  client: "/menu/home",
  vendor: "/vendor",
  admin: "/admin",
};

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function makeSessionUser({
  role = "client",
  name = "Гость toi.kz",
  phone = "",
  city = "Алматы",
  businessName = "",
  status = "active",
}) {
  const cleanedPhone = String(phone || "").replace(/\D/g, "");
  const suffix = cleanedPhone || Math.random().toString(36).slice(2, 10);

  return {
    uid: `${role}_${suffix}`,
    role,
    name,
    phone,
    city,
    businessName,
    status,
    createdAt: new Date().toISOString(),
  };
}

export function getSession() {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(SESSION_KEY);
  const parsed = stored ? safeJsonParse(stored) : null;

  if (!parsed?.uid || !parsed?.role) return null;
  return parsed;
}

export function setSession(user) {
  if (typeof window === "undefined") return;

  const cache = {
    uid: user.uid,
    role: user.role,
    name: user.name,
    city: user.city,
    businessName: user.businessName,
    status: user.status,
    emailVerified: Boolean(user.emailVerified),
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(cache));
  window.dispatchEvent(new Event("toi-session-change"));
}

export function updateSession(patch) {
  const current = getSession();
  if (!current) return null;

  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  setSession(next);
  return next;
}

export function clearSession() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("toi-session-change"));
}

export function canAccessRole(user, allowedRoles) {
  if (!user?.role) return false;
  return allowedRoles.includes(user.role);
}
