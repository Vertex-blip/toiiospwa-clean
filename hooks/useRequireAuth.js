"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { canAccessRole, clearSession, ROLE_ROUTES, setSession } from "@/lib/session";
import { readUserProfile, saveUserProfile } from "@/lib/firebaseData";

export function useRequireAuth({ allowedRoles = ["client", "vendor", "admin"], redirectTo = "/" } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const allowedKey = allowedRoles.join("|");

  useEffect(() => {
    let disposed = false;

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (disposed) return;

      if (!currentUser) {
        clearSession();
        setUser(null);
        setChecking(false);
        router.replace(redirectTo);
        return;
      }

      let firebaseUser = await readUserProfile(currentUser.uid);
      if (!firebaseUser?.email && firebaseUser?.role !== "admin") {
        firebaseUser = await saveUserProfile(currentUser.uid, {
          uid: currentUser.uid,
          role: "client",
          name: currentUser.displayName || "toi.kz user",
          phone: currentUser.phoneNumber || "",
          email: currentUser.email || "",
          status: "active",
        }).catch(() => ({
          uid: currentUser.uid,
          role: "client",
          name: currentUser.displayName || "toi.kz user",
          phone: currentUser.phoneNumber || "",
          email: currentUser.email || "",
          status: "active",
        }));
      }

      firebaseUser = {
        ...firebaseUser,
        uid: currentUser.uid,
        name: firebaseUser.name || currentUser.displayName || "toi.kz user",
        email: firebaseUser.email || currentUser.email || "",
        emailVerified: currentUser.emailVerified,
      };

      if (!canAccessRole(firebaseUser, allowedRoles)) {
        clearSession();
        setChecking(false);
        router.replace(ROLE_ROUTES[firebaseUser.role] || redirectTo);
        return;
      }

      setSession(firebaseUser);
      setUser(firebaseUser);
      setChecking(false);
    });

    return () => {
      disposed = true;
      unsub();
    };
  }, [allowedKey, redirectTo, router]);

  return { user, checking };
}
