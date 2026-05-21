"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Eye, EyeOff, Lock, Mail, ShieldCheck, User, Users } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useAppStore } from "@/lib/appStore";
import { readUserProfile, saveUserProfile, saveVendorProfile } from "@/lib/firebaseData";
import { auth, firebaseReady } from "@/lib/firebase";
import { isAdmin } from "@/lib/roles";
import { isValidEmail, normalizeEmail, normalizePhone, sanitizeText } from "@/lib/sanitize";
import { ROLE_ROUTES, setSession } from "@/lib/session";
import styles from "./AuthPage.module.css";

const DEFAULT_CITY = "Алматы";

function PasswordField({ value, onChange, placeholder, ariaLabel, visible, onToggle, autoComplete }) {
  return (
    <div className={styles.fieldWrap}>
      <Lock className={styles.fieldIcon} size={19} aria-hidden="true" />
      <input
        className={`${styles.input} ${styles.inputWithToggle}`}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete={autoComplete}
      />
      <button className={styles.iconButton} type="button" onClick={onToggle} aria-label={visible ? "Скрыть пароль" : "Показать пароль"}>
        {visible ? <EyeOff size={19} /> : <Eye size={19} />}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.52z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.44l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.41 13.89a6 6 0 0 1 0-3.78V7.52H3.07a10 10 0 0 0 0 8.96l3.34-2.59z" />
      <path fill="#EA4335" d="M12 5.99c1.47 0 2.78.5 3.82 1.5l2.87-2.87A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.93 5.52l3.34 2.59C7.2 7.74 9.4 5.99 12 5.99z" />
    </svg>
  );
}

function firebaseErrorMessage(error) {
  const code = error?.code || "";
  if (code === "auth/popup-closed-by-user") return "Google вход отменен";
  if (code === "auth/popup-blocked") return "Браузер заблокировал Google вход";
  if (code === "auth/account-exists-with-different-credential") return "Этот email уже использует другой способ входа";
  if (code === "auth/operation-not-allowed") return "Этот способ входа не включен в Firebase Authentication";
  if (code === "auth/configuration-not-found") return "Firebase Authentication не настроен для этого проекта";
  if (code === "auth/invalid-email") return "Введите корректный email";
  if (code === "auth/weak-password") return "Пароль слишком слабый. Минимум 6 символов";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") return "Неверный email или пароль";
  if (code === "auth/user-not-found") return "Пользователь не найден";
  if (code === "auth/email-already-in-use") return "Этот email уже зарегистрирован";
  if (code === "auth/too-many-requests") return "Слишком много попыток. Попробуйте позже";
  if (code === "auth/network-request-failed") return "Проверьте интернет соединение";
  if (code === "PERMISSION_DENIED" || /permission/i.test(error?.message || "")) return "Firebase Database Rules отклонили запись профиля";
  return "Ошибка авторизации";
}

export default function AuthPage({ initialTab = "login" }) {
  const router = useRouter();
  const { upsertCurrentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSplash, setShowSplash] = useState(true);
  const [pendingUser, setPendingUser] = useState(null);

  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 950);
    return () => window.clearTimeout(timer);
  }, []);

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function ensureFirebaseAuth() {
    if (firebaseReady && auth) return true;
    setSubmitting(false);
    setError("Firebase Auth не настроен. Проверьте NEXT_PUBLIC_FIREBASE_* переменные в Vercel.");
    return false;
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setPendingUser(null);
    setAdminUnlocked(false);
    resetMessages();
  }

  function handleLogoClick() {
    if (adminUnlocked) return;
    setAdminTapCount((count) => {
      const nextCount = count + 1;
      if (nextCount >= 4) {
        setAdminUnlocked(true);
        setPendingUser(null);
        resetMessages();
        return 0;
      }
      return nextCount;
    });
  }

  function buildSessionUser(firebaseUser, profile, role) {
    return {
      uid: firebaseUser.uid,
      role,
      name: profile?.name || firebaseUser.displayName || "TOI.KZ user",
      phone: profile?.phoneNumber || profile?.phone || firebaseUser.phoneNumber || "",
      email: firebaseUser.email || profile?.email || "",
      emailVerified: firebaseUser.emailVerified,
      city: profile?.city || DEFAULT_CITY,
      businessName: profile?.businessName || "",
      status: profile?.status || (role === "vendor" ? "pendingApproval" : "active"),
      createdAt: profile?.createdAt || Date.now(),
    };
  }

  function finishAuth(user, route) {
    setSession(user);
    upsertCurrentUser(user);
    setSubmitting(false);
    router.push(route || ROLE_ROUTES[user.role] || "/menu/home");
  }

  async function completeOrAskRole(firebaseUser, profile) {
    const role = profile?.role || "";
    if (role === "admin") {
      await signOut(auth).catch(() => {});
      setSubmitting(false);
      setError("Admin вход скрыт. Нажмите логотип TOI.KZ 4 раза.");
      return;
    }

    if (role === "client" || role === "vendor") {
      finishAuth(buildSessionUser(firebaseUser, profile, role), ROLE_ROUTES[role]);
      return;
    }

    setPendingUser({
      uid: firebaseUser.uid,
      name: profile?.name || firebaseUser.displayName || "TOI.KZ user",
      email: firebaseUser.email || profile?.email || "",
      phone: firebaseUser.phoneNumber || profile?.phone || "",
      emailVerified: firebaseUser.emailVerified,
      createdAt: profile?.createdAt || Date.now(),
    });
    setActiveTab("role");
    setSubmitting(false);
  }

  async function createPendingProfile(firebaseUser, displayName) {
    const profile = {
      uid: firebaseUser.uid,
      name: sanitizeText(displayName || firebaseUser.displayName || "TOI.KZ user", 80),
      email: normalizeEmail(firebaseUser.email || ""),
      phone: normalizePhone(firebaseUser.phoneNumber || ""),
      phoneNumber: normalizePhone(firebaseUser.phoneNumber || ""),
      phoneNumberNormalized: normalizePhone(firebaseUser.phoneNumber || ""),
      role: "",
      city: DEFAULT_CITY,
      status: "active",
      createdAt: Date.now(),
    };
    return saveUserProfile(firebaseUser.uid, profile).catch(() => profile);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setSubmitting(true);
    resetMessages();
    if (!ensureFirebaseAuth()) return;

    const safeEmail = normalizeEmail(loginId);
    if (!isValidEmail(safeEmail) || !loginPassword) {
      setSubmitting(false);
      setError("Введите email и пароль");
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, safeEmail, loginPassword);
      if (await isAdmin(credential.user.uid)) {
        await signOut(auth).catch(() => {});
        setSubmitting(false);
        setError("Admin вход скрыт. Нажмите логотип TOI.KZ 4 раза.");
        return;
      }
      let profile = await readUserProfile(credential.user.uid).catch(() => null);
      if (!profile?.uid) profile = await createPendingProfile(credential.user, credential.user.displayName);
      await completeOrAskRole(credential.user, profile);
    } catch (loginError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(loginError));
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setSubmitting(true);
    resetMessages();
    if (!ensureFirebaseAuth()) return;

    const safeName = sanitizeText(name, 80);
    const safeEmail = normalizeEmail(email);
    if (!safeName || !isValidEmail(safeEmail) || !registerPassword || !confirmPassword) {
      setSubmitting(false);
      setError("Заполните имя, email и пароль");
      return;
    }
    if (registerPassword.length < 6) {
      setSubmitting(false);
      setError("Пароль должен быть минимум 6 символов");
      return;
    }
    if (registerPassword !== confirmPassword) {
      setSubmitting(false);
      setError("Пароли не совпадают");
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, safeEmail, registerPassword);
      await updateProfile(credential.user, { displayName: safeName });
      await sendEmailVerification(credential.user).catch(() => {});
      const profile = await createPendingProfile(credential.user, safeName);
      setSuccess("Аккаунт создан. Выберите тип профиля.");
      await completeOrAskRole(credential.user, profile);
    } catch (registerError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(registerError));
    }
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    resetMessages();
    if (!ensureFirebaseAuth()) return;

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const credential = await signInWithPopup(auth, provider);

      if (await isAdmin(credential.user.uid)) {
        await signOut(auth).catch(() => {});
        setSubmitting(false);
        setError("Admin вход скрыт. Нажмите логотип TOI.KZ 4 раза.");
        return;
      }

      let profile = await readUserProfile(credential.user.uid).catch(() => null);
      if (!profile?.uid) profile = await createPendingProfile(credential.user, credential.user.displayName);
      await completeOrAskRole(credential.user, profile);
    } catch (googleError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(googleError));
    }
  }

  async function handleRoleSelect(role) {
    setSubmitting(true);
    resetMessages();
    if (!ensureFirebaseAuth()) return;

    const currentUser = auth.currentUser;
    if (!currentUser || !pendingUser?.uid || currentUser.uid !== pendingUser.uid) {
      setSubmitting(false);
      setError("Сессия устарела. Войдите заново.");
      return;
    }

    const profile = {
      uid: currentUser.uid,
      name: pendingUser.name,
      email: pendingUser.email,
      phone: pendingUser.phone || "",
      phoneNumber: pendingUser.phone || "",
      phoneNumberNormalized: pendingUser.phone || "",
      role,
      city: DEFAULT_CITY,
      businessName: role === "vendor" ? pendingUser.name : "",
      status: role === "vendor" ? "pendingApproval" : "active",
      createdAt: pendingUser.createdAt || Date.now(),
    };

    try {
      const savedProfile = await saveUserProfile(currentUser.uid, profile);
      if (role === "vendor") {
        await saveVendorProfile(currentUser.uid, {
          id: currentUser.uid,
          ownerId: currentUser.uid,
          businessName: pendingUser.name,
          title: pendingUser.name,
          category: "Услуги",
          city: DEFAULT_CITY,
          description: "Vendor profile is waiting for administrator approval.",
          priceFrom: 0,
          status: "pending",
          phone: pendingUser.phone || "",
          image: "/images/toi-login-bg.png",
          features: [],
          availableDates: [],
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      }
      finishAuth(buildSessionUser(currentUser, savedProfile, role), ROLE_ROUTES[role]);
    } catch (roleError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(roleError));
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault();
    setSubmitting(true);
    resetMessages();
    if (!ensureFirebaseAuth()) return;

    const safeEmail = normalizeEmail(adminEmail);
    if (!isValidEmail(safeEmail) || !adminPassword) {
      setSubmitting(false);
      setError("Введите admin email и пароль");
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, safeEmail, adminPassword);
      const allowed = await isAdmin(credential.user.uid);
      if (!allowed) {
        await signOut(auth).catch(() => {});
        setSubmitting(false);
        setError("Доступ запрещен. В Firebase должно быть admins/{uid}: true.");
        return;
      }

      const profile = await readUserProfile(credential.user.uid).catch(() => null);
      finishAuth(buildSessionUser(credential.user, profile, "admin"), "/admin");
    } catch (adminError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(adminError));
    }
  }

  const message = error || success ? (
    <div className={styles.message} role="status" aria-live="polite">
      {error ? <div className={`${styles.alert} ${styles.error}`}>{error}</div> : null}
      {success ? <div className={`${styles.alert} ${styles.success}`}>{success}</div> : null}
    </div>
  ) : null;

  if (showSplash) {
    return (
      <main className={`${styles.page} ${styles.splashPage}`}>
        <div className={styles.cinematicLayer} aria-hidden="true" />
        <section className={styles.splashCard} aria-label="TOI.KZ loading">
          <div className={styles.splashLogo}>
            <img src="/icons/toi-blue-logo.png" alt="TOI.KZ" />
          </div>
          <p>TOI.KZ</p>
          <span>Жүктелуде...</span>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.cinematicLayer} aria-hidden="true" />
      <div className={styles.shell}>
        <aside className={styles.storyPanel} aria-label="TOI.KZ premium wedding platform">
          <div className={styles.storyLogo}>
            <img src="/icons/toi-blue-logo.png" alt="" />
          </div>
          <p className={styles.eyebrow}>Premium wedding PWA</p>
          <h2>Тойды басқарудың жаңа деңгейі</h2>
          <p>Қонақтар, бюджет, бронь және vendor сервистері бір қауіпсіз TOI.KZ кеңістігінде.</p>
        </aside>

        <section className={styles.card} aria-label="Авторизация TOI.KZ">
          <div className={styles.content}>
            <header className={styles.brand}>
              <button className={styles.logoBadge} type="button" onClick={handleLogoClick} aria-label="TOI.KZ">
                <img className={styles.logoMark} src="/icons/toi-blue-logo.png" alt="" />
              </button>
              <h1 className={styles.logoText}>TOI.KZ</h1>
              <p className={styles.tagline}>Premium wedding platform</p>
            </header>

            {adminUnlocked ? (
              <div className={styles.formPanel} key="admin-login">
                <div className={styles.formHeader}>
                  <h2>Admin secure entry</h2>
                  <p>Доступ только для аккаунта с Firebase Realtime Database admins/uid: true.</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleAdminLogin}>
                  <div className={styles.fieldWrap}>
                    <ShieldCheck className={styles.fieldIcon} size={19} aria-hidden="true" />
                    <input className={styles.input} type="email" value={adminEmail} onChange={(e) => setAdminEmail(sanitizeText(e.target.value, 254))} placeholder="Admin email" aria-label="Admin email" autoComplete="username" />
                  </div>
                  <PasswordField value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Admin password" ariaLabel="Admin password" visible={showAdminPassword} onToggle={() => setShowAdminPassword((value) => !value)} autoComplete="current-password" />
                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Проверяем..." : "Войти в admin panel"}
                  </button>
                  <button className={styles.backButton} type="button" onClick={() => { setAdminUnlocked(false); resetMessages(); }}>
                    Вернуться
                  </button>
                </form>
              </div>
            ) : null}

            {!adminUnlocked && activeTab === "login" ? (
              <div className={styles.formPanel} key="login">
                <div className={styles.formHeader}>
                  <h2>Қош келдіңіз</h2>
                  <p>Войдите, чтобы продолжить организацию вашего тоя.</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleLogin}>
                  <div className={styles.fieldWrap}>
                    <Mail className={styles.fieldIcon} size={19} aria-hidden="true" />
                    <input className={styles.input} type="email" value={loginId} onChange={(e) => setLoginId(sanitizeText(e.target.value, 254))} placeholder="Email" aria-label="Email" autoComplete="username" autoCapitalize="none" />
                  </div>
                  <PasswordField value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Пароль" ariaLabel="Пароль" visible={showLoginPassword} onToggle={() => setShowLoginPassword((value) => !value)} autoComplete="current-password" />
                  <div className={styles.rowEnd}>
                    <button className={styles.linkButton} type="button" onClick={() => router.push("/forgot-password")}>
                      Забыли пароль?
                    </button>
                  </div>
                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Входим..." : "Войти"}
                  </button>
                  <button className={styles.googleButton} type="button" onClick={handleGoogleLogin} disabled={submitting}>
                    <GoogleIcon />
                    Continue with Google
                  </button>
                </form>
                <p className={styles.switchText}>
                  Нет аккаунта? <button type="button" onClick={() => switchTab("register")}>Зарегистрироваться</button>
                </p>
              </div>
            ) : null}

            {!adminUnlocked && activeTab === "register" ? (
              <div className={styles.formPanel} key="register">
                <div className={styles.formHeader}>
                  <h2>Создать аккаунт</h2>
                  <p>Минимум данных сейчас. Роль выберете на следующем шаге.</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleRegister}>
                  <div className={styles.fieldWrap}>
                    <User className={styles.fieldIcon} size={19} aria-hidden="true" />
                    <input className={styles.input} type="text" value={name} onChange={(e) => setName(sanitizeText(e.target.value, 80))} placeholder="Имя" aria-label="Имя" autoComplete="name" />
                  </div>
                  <div className={styles.fieldWrap}>
                    <Mail className={styles.fieldIcon} size={19} aria-hidden="true" />
                    <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(sanitizeText(e.target.value, 254))} placeholder="Email" aria-label="Email" autoComplete="email" autoCapitalize="none" />
                  </div>
                  <PasswordField value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Пароль" ariaLabel="Пароль" visible={showRegisterPassword} onToggle={() => setShowRegisterPassword((value) => !value)} autoComplete="new-password" />
                  <PasswordField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Повторите пароль" ariaLabel="Повторите пароль" visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} autoComplete="new-password" />
                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Создаем..." : "Зарегистрироваться"}
                  </button>
                  <button className={styles.googleButton} type="button" onClick={handleGoogleLogin} disabled={submitting}>
                    <GoogleIcon />
                    Sign up with Google
                  </button>
                </form>
                <p className={styles.switchText}>
                  Уже есть аккаунт? <button type="button" onClick={() => switchTab("login")}>Войти</button>
                </p>
              </div>
            ) : null}

            {!adminUnlocked && activeTab === "role" ? (
              <div className={styles.formPanel} key="role">
                <div className={styles.formHeader}>
                  <h2>Профиль түрін таңдаңыз</h2>
                  <p>Бұл таңдау Firebase профиліңізге сақталады.</p>
                </div>
                {message}
                <div className={styles.roleChoiceGrid}>
                  <button className={styles.roleChoice} type="button" onClick={() => handleRoleSelect("client")} disabled={submitting}>
                    <Users size={22} aria-hidden="true" />
                    <span>Мен той ұйымдастырамын</span>
                  </button>
                  <button className={styles.roleChoice} type="button" onClick={() => handleRoleSelect("vendor")} disabled={submitting}>
                    <Briefcase size={22} aria-hidden="true" />
                    <span>Мен қызмет көрсетемін</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
