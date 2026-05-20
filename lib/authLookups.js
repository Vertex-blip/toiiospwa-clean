import { get, ref, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { normalizeEmail, normalizePhone } from "@/lib/sanitize";

export function phoneLookupKey(value) {
  return normalizePhone(value).replace(/\D/g, "");
}

export async function findEmailByPhone(phoneValue) {
  const key = phoneLookupKey(phoneValue);
  if (!key) return null;

  const snap = await get(ref(db, `phoneLoginIndex/${key}`));
  if (!snap.exists()) return null;

  const email = normalizeEmail(snap.val()?.email || "");
  return email || null;
}

export async function writePhoneLoginIndex({ phone, email, uid }) {
  const key = phoneLookupKey(phone);
  const safeEmail = normalizeEmail(email);
  if (!key || !safeEmail || !uid) return;

  await set(ref(db, `phoneLoginIndex/${key}`), {
    uid,
    email: safeEmail,
    updatedAt: Date.now(),
  });
}
