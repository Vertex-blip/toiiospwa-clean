import { readAdminFlag } from "@/lib/firebaseData";

export async function isAdmin(uid) {
  return readAdminFlag(uid);
}

export async function getUserRole(uid) {
  return (await isAdmin(uid)) ? "admin" : "client";
}
