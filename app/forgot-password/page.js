"use client";

import { ToastProvider, useToast } from "@/components/Toast";
import styles from "@/components/AuthPage.module.css";
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
    <main className={styles.page}>
      <div className={styles.cinematicLayer} aria-hidden="true" />
      <div className={styles.forgotShell}>
        <section className={`${styles.card} ${styles.forgotCard}`} aria-label="Восстановление пароля TOI.KZ">
          <div className={styles.content}>
            <div className={styles.forgotTop}>
              <button className={styles.backButton} type="button" onClick={() => router.back()}>
                <ArrowLeft size={16} />
                Назад
              </button>
              <div className={styles.forgotLogo}>
                <img src="/icons/toi-blue-logo.png" alt="TOI.KZ" />
                <span>
                  <strong>TOI.KZ</strong>
                  <small>Восстановление доступа</small>
                </span>
              </div>
            </div>

            <header className={styles.formHeader}>
              <p className={styles.eyebrow}>Secure reset</p>
              <h1>Восстановление пароля</h1>
              <p>Введите email, указанный при регистрации. Мы отправим ссылку для сброса пароля.</p>
            </header>

            {sent ? (
              <div className={styles.form}>
                <StatusLine title="Письмо отправлено" text="Проверьте почту и папку “Спам”. Ссылка для сброса пароля будет внутри письма." />
                <button className={styles.primaryButton} type="button" onClick={() => router.replace("/")}>
                  Вернуться ко входу
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSend}>
                <div className={styles.fieldWrap}>
                  <Mail className={styles.fieldIcon} size={20} aria-hidden="true" />
                  <input
                    className={styles.input}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.slice(0, 254))}
                    placeholder="you@example.com"
                    aria-label="Email"
                    autoComplete="email"
                    autoCapitalize="none"
                  />
                </div>
                <button className={styles.primaryButton} type="submit" disabled={loading}>
                  {loading ? <span className="spinner" /> : "Отправить ссылку"}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusLine({ title, text }) {
  return (
    <div className={styles.statusBox}>
      <strong>{title}</strong>
      <p>{text}</p>
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
