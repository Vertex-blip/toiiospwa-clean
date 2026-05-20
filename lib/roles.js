import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";

export async function isAdmin(uid) {
  if (!uid) return false;

  const snap = await get(ref(db, `admins/${uid}`));
  return snap.exists() && snap.val() === true;
}

export async function getUserRole(uid) {
  return (await isAdmin(uid)) ? "admin" : "user";
}
