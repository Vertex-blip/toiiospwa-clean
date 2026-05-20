"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { canAccessRole, getSession, ROLE_ROUTES } from "@/lib/session";
import { isAdmin } from "@/lib/roles";

export function useRequireAuth({ allowedRoles = ["client", "vendor", "admin"], redirectTo = "/" } = {}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const allowedKey = allowedRoles.join("|");

  useEffect(() => {
    let disposed = false;

    const localUser = getSession();
    if (localUser) {
      if (localUser.role === "admin" || (allowedRoles.length === 1 && allowedRoles[0] === "admin")) {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
          if (disposed) return;

          if (!currentUser || currentUser.uid !== localUser.uid || !(await isAdmin(currentUser.uid))) {
            setUser(null);
            setChecking(false);
            router.replace(redirectTo);
            return;
          }

          setUser({ ...localUser, role: "admin" });
          setChecking(false);
        });

        return () => {
          disposed = true;
          unsub();
        };
      }

      if (canAccessRole(localUser, allowedRoles)) {
        setUser(localUser);
        setChecking(false);
      } else {
        router.replace(ROLE_ROUTES[localUser.role] || redirectTo);
      }
      return undefined;
    }

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (disposed) return;

      if (!currentUser) {
        setUser(null);
        setChecking(false);
        router.replace(redirectTo);
        return;
      }

      const adminAllowed = await isAdmin(currentUser.uid);
      const firebaseUser = {
        uid: currentUser.uid,
        role: adminAllowed ? "admin" : "client",
        name: currentUser.displayName || "toi.kz user",
        phone: currentUser.phoneNumber || "",
        email: currentUser.email || "",
      };

      if (!canAccessRole(firebaseUser, allowedRoles)) {
        setChecking(false);
        router.replace(redirectTo);
        return;
      }

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
