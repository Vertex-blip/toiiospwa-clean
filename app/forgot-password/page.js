"use client";

import { ToastProvider, useToast } from "@/components/Toast";
import { auth } from "@/lib/firebase";
import { isValidEmail, normalizeEmail } from "@/lib/sanitize";
import { sendPasswordResetEmail } from "firebase/auth";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ForgotInner() {
  const router = useRouter();
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend(e) {
    e.preventDefault();

    const safeEmail = normalizeEmail(email);
    if (!safeEmail || !isValidEmail(safeEmail)) {
      showToast("Введите корректный email");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, safeEmail);
      setSent(true);
      showToast("Инструкции отправлены");
    } catch (error) {
      const code = error?.code || "";
      if (code === "auth/user-not-found") showToast("Пользователь с таким email не найден");
      else if (code === "auth/invalid-email") showToast("Некорректный формат email");
      else showToast("Не удалось отправить письмо");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-loader" style={{ padding: 18 }}>
      <section className="premium-card premium-card-inner" style={{ width: "min(520px, 94vw)" }}>
        <button className="ghost-button" type="button" onClick={() => router.back()} style={{ marginBottom: 18 }}>
          <ArrowLeft size={16} />
          Назад
        </button>
        <div className="app-brand" style={{ marginBottom: 22 }}>
          <img className="app-brand-logo" src="/images/toi-logo.png" alt="toi.kz" />
          <span>
            <strong>TOI.KZ</strong>
            <small>Восстановление доступа</small>
          </span>
        </div>

        {sent ? (
          <div className="page-stack">
            <StatusLine tone="success" title="Письмо отправлено" text="Проверьте почту и папку “Спам”. Ссылка для сброса пароля будет внутри письма." />
            <button className="premium-button" type="button" onClick={() => router.replace("/")}>
              Вернуться ко входу
            </button>
          </div>
        ) : (
          <form className="page-stack" onSubmit={handleSend}>
            <div>
              <h1 style={{ margin: 0, fontFamily: "Playfair Display, Georgia, serif", fontSize: 34 }}>Восстановление пароля</h1>
              <p className="muted">Введите email, указанный при регистрации. Мы отправим ссылку для сброса пароля.</p>
            </div>
            <label>
              <span className="chip" style={{ marginBottom: 8 }}><Mail size={14} /> Email</span>
              <input
                className="premium-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.slice(0, 254))}
                placeholder="you@example.com"
                aria-label="Email"
                autoComplete="email"
                autoCapitalize="none"
              />
            </label>
            <button className="premium-button" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Отправить ссылку"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function StatusLine({ title, text }) {
  return (
    <div className="premium-card premium-card-inner" style={{ background: "rgba(34,197,94,0.08)" }}>
      <strong>{title}</strong>
      <p className="muted" style={{ marginBottom: 0 }}>{text}</p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <ToastProvider>
      <ForgotInner />
    </ToastProvider>
  );
}
