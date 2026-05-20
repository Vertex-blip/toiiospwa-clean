"use client";

import { useEffect } from "react";

export default function ClientBoot() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }

    try {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") document.documentElement.classList.add("dark");
    } catch {
      // Ignore storage errors in restricted browser modes.
    }
  }, []);

  return null;
}
