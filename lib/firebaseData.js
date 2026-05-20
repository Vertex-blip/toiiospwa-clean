import { equalTo, get, orderByChild, query, ref, set, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { normalizeEmail, normalizePhone, sanitizeText } from "@/lib/sanitize";

export function snapshotToArray(snapshot) {
  if (!snapshot?.exists()) return [];
  const value = snapshot.val();
  if (Array.isArray(value)) return value.filter(Boolean);
  return Object.entries(value).map(([id, row]) => ({ id, ...row }));
}

export async function readOnce(path) {
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? snapshot.val() : null;
}

export async function readAdminFlag(uid) {
  if (!uid) return false;
  const snapshot = await get(ref(db, `admins/${uid}`)).catch(() => null);
  return snapshot?.exists() && snapshot.val() === true;
}

export async function readUserProfile(uid) {
  if (!uid) return null;

  const [profileSnapshot, legacySnapshot, adminAllowed] = await Promise.all([
    get(ref(db, `users/${uid}`)).catch(() => null),
    get(ref(db, `Users/${uid}`)).catch(() => null),
    readAdminFlag(uid),
  ]);

  const profile = profileSnapshot?.exists()
    ? profileSnapshot.val()
    : legacySnapshot?.exists()
      ? legacySnapshot.val()
      : {};

  return {
    uid,
    role: adminAllowed ? "admin" : profile.role || "client",
    name: profile.name || "",
    email: normalizeEmail(profile.email || ""),
    phone: normalizePhone(profile.phone || profile.phoneNumber || ""),
    phoneNumber: normalizePhone(profile.phoneNumber || profile.phone || ""),
    phoneNumberNormalized: normalizePhone(profile.phoneNumberNormalized || profile.phone || profile.phoneNumber || ""),
    city: profile.city || "Алматы",
    businessName: profile.businessName || "",
    status: profile.status || "active",
    createdAt: profile.createdAt || Date.now(),
    updatedAt: profile.updatedAt || Date.now(),
  };
}

export async function saveUserProfile(uid, profile) {
  if (!uid) throw new Error("Missing user id");
  const role = profile.role === "admin" ? "client" : profile.role || "client";
  const phone = normalizePhone(profile.phone || profile.phoneNumber || "");
  const payload = {
    uid,
    role,
    name: sanitizeText(profile.name, 80),
    email: normalizeEmail(profile.email || ""),
    phone,
    phoneNumber: phone,
    phoneNumberNormalized: phone,
    city: sanitizeText(profile.city || "Алматы", 80),
    businessName: sanitizeText(profile.businessName || "", 120),
    status: sanitizeText(profile.status || (role === "vendor" ? "pendingApproval" : "active"), 32),
    createdAt: profile.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  await set(ref(db, `users/${uid}`), payload);
  return payload;
}

export async function patchUserProfile(uid, patch) {
  if (!uid) throw new Error("Missing user id");
  const cleanPatch = { ...patch, updatedAt: Date.now() };
  if (cleanPatch.role === "admin") delete cleanPatch.role;
  if (cleanPatch.email) cleanPatch.email = normalizeEmail(cleanPatch.email);
  if (cleanPatch.phone || cleanPatch.phoneNumber) {
    const phone = normalizePhone(cleanPatch.phone || cleanPatch.phoneNumber);
    cleanPatch.phone = phone;
    cleanPatch.phoneNumber = phone;
    cleanPatch.phoneNumberNormalized = phone;
  }
  if (cleanPatch.name) cleanPatch.name = sanitizeText(cleanPatch.name, 80);
  if (cleanPatch.city) cleanPatch.city = sanitizeText(cleanPatch.city, 80);

  await update(ref(db, `users/${uid}`), cleanPatch);
  return cleanPatch;
}

export async function saveVendorProfile(vendorId, vendor) {
  if (!vendorId) throw new Error("Missing vendor id");
  const payload = {
    id: vendorId,
    ownerId: vendor.ownerId,
    businessName: sanitizeText(vendor.businessName || vendor.title || "", 120),
    title: sanitizeText(vendor.title || vendor.businessName || "", 120),
    category: sanitizeText(vendor.category || "Залы", 80),
    city: sanitizeText(vendor.city || "Алматы", 80),
    description: sanitizeText(vendor.description || "", 500),
    priceFrom: Number(vendor.priceFrom || 0),
    capacity: vendor.capacity ? Number(vendor.capacity) : null,
    rating: Number(vendor.rating || 0),
    reviewsCount: Number(vendor.reviewsCount || 0),
    verified: Boolean(vendor.verified),
    featured: Boolean(vendor.featured),
    status: vendor.status || "pending",
    phone: normalizePhone(vendor.phone || ""),
    whatsapp: sanitizeText(vendor.whatsapp || "", 32),
    instagram: sanitizeText(vendor.instagram || "", 80),
    image: vendor.image || "/images/toi-login-bg.png",
    features: Array.isArray(vendor.features) ? vendor.features : [],
    availableDates: Array.isArray(vendor.availableDates) ? vendor.availableDates : [],
    createdAt: vendor.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await set(ref(db, `vendors/${vendorId}`), payload);
  return payload;
}

export async function readApprovedVendors() {
  const snapshot = await get(query(ref(db, "vendors"), orderByChild("status"), equalTo("approved"))).catch(() => null);
  if (snapshot?.exists()) return snapshotToArray(snapshot);

  const legacy = await get(ref(db, "Halls")).catch(() => null);
  return snapshotToArray(legacy);
}

export async function readActiveServices() {
  const snapshot = await get(query(ref(db, "services"), orderByChild("active"), equalTo(true))).catch(() => null);
  return snapshotToArray(snapshot);
}

export async function readUserEvents(uid) {
  if (!uid) return [];
  const snapshot = await get(query(ref(db, "events"), orderByChild("userId"), equalTo(uid))).catch(() => null);
  return snapshotToArray(snapshot);
}

export async function readClientBookings(uid) {
  if (!uid) return [];
  const snapshot = await get(query(ref(db, "bookings"), orderByChild("clientId"), equalTo(uid))).catch(() => null);
  return snapshotToArray(snapshot);
}
