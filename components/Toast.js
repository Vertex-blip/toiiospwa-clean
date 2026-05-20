"use client";
import { useEffect, useState, createContext, useContext } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback: simple alert if not within provider
    return (msg) => {
      const el = document.createElement("div");
      el.className = "toast";
      el.textContent = msg;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2800);
    };
  }
  return ctx;
}
