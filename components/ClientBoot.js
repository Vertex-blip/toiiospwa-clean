"use client";

import { useEffect } from "react";

export default function ClientBoot() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.warn("Service worker registration failed", error);
        });
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
