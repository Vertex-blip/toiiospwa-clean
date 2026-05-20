"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  Calendar,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { CATEGORIES, EVENT_TYPES, KZ_CITIES } from "@/lib/appData";
import { useAppStore } from "@/lib/appStore";
import { findEmailByPhone, writePhoneLoginIndex } from "@/lib/authLookups";
import { auth, db } from "@/lib/firebase";
import { isValidEmail, isValidKazakhstanPhone, normalizeEmail, normalizePhone, sanitizeText } from "@/lib/sanitize";
import { makeSessionUser, ROLE_ROUTES, setSession } from "@/lib/session";
import styles from "./AuthPage.module.css";

function PasswordField({ value, onChange, placeholder, ariaLabel, visible, onToggle, autoComplete = "current-password" }) {
  return (
    <div className={styles.fieldWrap}>
      <Lock className={styles.fieldIcon} size={20} aria-hidden="true" />
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
        {visible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}

function firebaseErrorMessage(error) {
  const code = error?.code || "";
  if (code === "auth/operation-not-allowed") return "Email/password вход не включен в Firebase Authentication";
  if (code === "auth/configuration-not-found") return "Firebase Authentication не настроен для этого проекта";
  if (code === "auth/invalid-email") return "Введите корректный email";
  if (code === "auth/weak-password") return "Пароль слишком слабый. Минимум 6 символов";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") return "Неверный email или пароль";
  if (code === "auth/user-not-found") return "Пользователь не найден";
  if (code === "auth/email-already-in-use") return "Этот email уже зарегистрирован";
  if (code === "auth/too-many-requests") return "Слишком много попыток. Попробуйте позже";
  if (code === "auth/network-request-failed") return "Проверьте интернет соединение";
  if (code === "PERMISSION_DENIED" || /permission/i.test(error?.message || "")) return "Аккаунт создан, но база данных отклонила запись профиля. Обновите Firebase Database Rules";
  return "Ошибка авторизации";
}

export default function AuthPage({ initialTab = "login" }) {
  const router = useRouter();
  const { setStore, upsertCurrentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [accountType, setAccountType] = useState("client");
  const [phoneLoginMode, setPhoneLoginMode] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Алматы");
  const [eventType, setEventType] = useState("Үйлену той");
  const [businessName, setBusinessName] = useState("");
  const [vendorCategory, setVendorCategory] = useState("Залы");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneOnly, setPhoneOnly] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const accountCopy =
    accountType === "vendor"
      ? {
          title: "Кабинет поставщика услуг",
          subtitle: "Получайте заявки, управляйте календарем и профилем услуги",
          icon: Briefcase,
        }
      : {
          title: "Я организую той",
          subtitle: "План, гости, бюджет, бронь и приглашения в одном приложении",
          icon: Users,
        };

  function resetMessages() {
    setError("");
    setSuccess("");
  }

  function showError(message) {
    setSuccess("");
    setError(message);
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setPhoneLoginMode(false);
    resetMessages();
  }

  function finishAuth(user, route) {
    setSession(user);
    upsertCurrentUser(user);
    setSubmitting(false);
    router.push(route || ROLE_ROUTES[user.role] || "/menu/home");
  }

  async function getUserProfile(uid) {
    const snap = await get(ref(db, `Users/${uid}`)).catch(() => null);
    return snap?.exists() ? snap.val() : null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setSubmitting(true);
    resetMessages();

    const safeLoginId = sanitizeText(loginId, 254);
    if (!safeLoginId || !password) {
      setSubmitting(false);
      setError("Введите email или телефон и пароль");
      return;
    }

    try {
      let loginEmail = "";

      if (safeLoginId.includes("@")) {
        loginEmail = normalizeEmail(safeLoginId);
        if (!isValidEmail(loginEmail)) {
          setSubmitting(false);
          setError("Введите корректный email");
          return;
        }
      } else {
        const safePhone = normalizePhone(safeLoginId);
        if (!isValidKazakhstanPhone(safePhone)) {
          setSubmitting(false);
          setError("Введите email или корректный номер +7XXXXXXXXXX");
          return;
        }

        loginEmail = await findEmailByPhone(safePhone);
        if (!loginEmail) {
          setSubmitting(false);
          setError("Пользователь с таким номером не найден. Войдите через email или зарегистрируйтесь.");
          return;
        }
      }

      const credential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const profile = await getUserProfile(credential.user.uid);
      const role = profile?.role || accountType || "client";
      const profilePhone = profile?.phoneNumber || profile?.phone || credential.user.phoneNumber || "";
      if (profilePhone) {
        await writePhoneLoginIndex({ phone: profilePhone, email: credential.user.email || loginEmail, uid: credential.user.uid }).catch(() => {});
      }
      const user = {
        uid: credential.user.uid,
        role,
        name: profile?.name || credential.user.displayName || "toi.kz user",
        phone: profilePhone,
        email: credential.user.email || loginEmail,
        emailVerified: credential.user.emailVerified,
        city: profile?.city || city,
        businessName: profile?.businessName || "",
        status: profile?.status || "active",
        createdAt: profile?.createdAt || new Date().toISOString(),
      };

      finishAuth(user, role === "vendor" ? "/vendor" : role === "admin" ? "/admin" : "/menu/home");
    } catch (loginError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(loginError));
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setSubmitting(true);
    resetMessages();

    const safeName = sanitizeText(name, 80);
    const safeEmail = normalizeEmail(email);
    const safePhone = normalizePhone(registerPhone);
    const safeBusinessName = sanitizeText(businessName, 120);

    if (!safeName || !safeEmail || !safePhone || !registerPassword || !confirmPassword) {
      setSubmitting(false);
      setError("Заполните все поля");
      return;
    }

    if (!isValidEmail(safeEmail)) {
      setSubmitting(false);
      setError("Введите корректный email");
      return;
    }

    if (!isValidKazakhstanPhone(safePhone)) {
      setSubmitting(false);
      setError("Введите корректный номер телефона +7XXXXXXXXXX");
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

    if (accountType === "vendor" && !safeBusinessName) {
      setSubmitting(false);
      setError("Укажите название бизнеса");
      return;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, safeEmail, registerPassword);
      await updateProfile(credential.user, { displayName: safeName });
      await sendEmailVerification(credential.user).catch(() => {});

      const profile = {
        uid: credential.user.uid,
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        phoneNumber: safePhone,
        phoneNumberNormalized: safePhone,
        role: accountType,
        city,
        eventType: accountType === "client" ? eventType : "",
        businessName: accountType === "vendor" ? safeBusinessName : "",
        vendorCategory: accountType === "vendor" ? vendorCategory : "",
        instagram: accountType === "vendor" ? sanitizeText(instagram, 80) : "",
        whatsapp: accountType === "vendor" ? sanitizeText(whatsapp, 32) : "",
        status: accountType === "vendor" ? "pendingApproval" : "active",
        createdAt: Date.now(),
      };

      const profileWrite = await set(ref(db, `Users/${credential.user.uid}`), profile).then(() => true).catch(() => false);
      await writePhoneLoginIndex({ phone: safePhone, email: safeEmail, uid: credential.user.uid }).catch(() => {});

      const user = makeSessionUser({
        role: accountType,
        name: safeName,
        phone: safePhone,
        city,
        businessName: safeBusinessName,
        status: profile.status,
      });
      user.uid = credential.user.uid;
      user.email = safeEmail;
      user.emailVerified = credential.user.emailVerified;
      user.createdAt = new Date(profile.createdAt).toISOString();

      if (accountType === "vendor") {
        setStore((current) => ({
          ...current,
          vendors: [
            {
              id: credential.user.uid,
              ownerId: credential.user.uid,
              businessName: safeBusinessName,
              title: safeBusinessName,
              category: vendorCategory,
              city,
              description: "Новый vendor profile ожидает проверки администратора.",
              priceFrom: 0,
              capacity: null,
              rating: 0,
              reviewsCount: 0,
              verified: false,
              featured: false,
              status: "pending",
              phone: safePhone,
              whatsapp: sanitizeText(whatsapp, 32),
              instagram: sanitizeText(instagram, 80),
              image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
              features: [],
              availableDates: [],
              createdAt: new Date().toISOString(),
            },
            ...current.vendors.filter((vendor) => vendor.ownerId !== credential.user.uid),
          ],
        }));
      }

      if (!profileWrite) {
        setSuccess("Аккаунт создан. Профиль сохранится после обновления Firebase Database Rules.");
      }

      finishAuth(user, accountType === "vendor" ? "/vendor" : "/menu/home");
    } catch (registerError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(registerError));
    }
  }

  function handlePhoneLoginStart() {
    setPhoneLoginMode(true);
    setError("");
    setSuccess("");
  }

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    resetMessages();

    const safePhone = normalizePhone(phoneOnly);
    if (!isValidKazakhstanPhone(safePhone)) {
      setSubmitting(false);
      showError("Введите корректный номер телефона");
      return;
    }

    if (!password) {
      setSubmitting(false);
      showError("Введите пароль");
      return;
    }

    try {
      const loginEmail = await findEmailByPhone(safePhone);
      if (!loginEmail) {
        setSubmitting(false);
        showError("Неверный телефон или пароль");
        return;
      }

      const credential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const profile = await getUserProfile(credential.user.uid);
      const role = profile?.role || "client";
      const profilePhone = profile?.phoneNumber || profile?.phone || safePhone;
      await writePhoneLoginIndex({ phone: profilePhone, email: credential.user.email || loginEmail, uid: credential.user.uid }).catch(() => {});

      const user = {
        uid: credential.user.uid,
        role,
        name: profile?.name || credential.user.displayName || "toi.kz user",
        phone: profilePhone,
        email: credential.user.email || loginEmail,
        emailVerified: credential.user.emailVerified,
        city: profile?.city || city,
        businessName: profile?.businessName || "",
        status: profile?.status || "active",
        createdAt: profile?.createdAt || new Date().toISOString(),
      };

      finishAuth(user, role === "vendor" ? "/vendor" : role === "admin" ? "/admin" : "/menu/home");
    } catch (phoneLoginError) {
      setSubmitting(false);
      setError(firebaseErrorMessage(phoneLoginError));
    }
  }

  async function handleForgotPassword() {
    const safeLoginId = sanitizeText(loginId, 254);
    if (!safeLoginId || !safeLoginId.includes("@")) {
      setError("");
      setSuccess("Введите email, чтобы восстановить пароль");
      return;
    }

    const safeEmail = normalizeEmail(safeLoginId);
    if (!isValidEmail(safeEmail)) {
      setError("");
      setSuccess("Введите email, чтобы восстановить пароль");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, safeEmail);
      setError("");
      setSuccess("Письмо для восстановления отправлено");
    } catch {
      setError("");
      setSuccess("Если email зарегистрирован, письмо для восстановления будет отправлено");
    }
  }

  const AccountIcon = accountCopy.icon;
  const message = (
    <div className={styles.message} role="status" aria-live="polite">
      {error ? <div className={`${styles.alert} ${styles.error}`}>{error}</div> : null}
      {success ? <div className={`${styles.alert} ${styles.success}`}>{success}</div> : null}
    </div>
  );

  return (
    <main className={styles.page}>
      <div className={styles.overlay} />
      <div className={styles.shell}>
        <section className={styles.card} aria-label="Авторизация toi.kz">
          <div className={styles.content}>
            <header className={styles.brand}>
              <img className={styles.brandLogo} src="/images/toi-logo.png" alt="toi.kz" />
              <div className={styles.ornamentLine} aria-hidden="true">
                <span className={styles.diamond} />
              </div>
              <p className={styles.tagline}>Сервис для вашего идеального тоя</p>
            </header>

            <div className={styles.tabs} role="tablist" aria-label="Тип формы">
              <button className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`} type="button" role="tab" aria-selected={activeTab === "login"} onClick={() => switchTab("login")}>
                Вход
              </button>
              <button className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`} type="button" role="tab" aria-selected={activeTab === "register"} onClick={() => switchTab("register")}>
                Регистрация
              </button>
            </div>

            <div className={styles.roleSwitch} aria-label="Тип аккаунта">
              <button className={`${styles.roleOption} ${accountType === "client" ? styles.roleActive : ""}`} type="button" onClick={() => setAccountType("client")}>
                <Users size={18} aria-hidden="true" />
                <span>Я организую той</span>
              </button>
              <button className={`${styles.roleOption} ${accountType === "vendor" ? styles.roleActive : ""}`} type="button" onClick={() => setAccountType("vendor")}>
                <Briefcase size={18} aria-hidden="true" />
                <span>Я предоставляю услугу</span>
              </button>
            </div>

            <div className={styles.accountHint}>
              <AccountIcon size={18} aria-hidden="true" />
              <span>
                <strong>{accountCopy.title}</strong>
                {accountCopy.subtitle}
              </span>
            </div>

            {activeTab === "login" && !phoneLoginMode ? (
              <div className={styles.formPanel} key="login">
                <div className={styles.formHeader}>
                  <h2>Войдите в свой аккаунт</h2>
                  <p>Управляйте вашим тоем легко и удобно</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleLogin}>
                  <div className={styles.fieldWrap}>
                    <Mail className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="text" value={loginId} onChange={(e) => setLoginId(sanitizeText(e.target.value, 254))} placeholder="Email или телефон" aria-label="Email или телефон" autoComplete="username" />
                  </div>
                  <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" ariaLabel="Пароль" visible={showLoginPassword} onToggle={() => setShowLoginPassword((value) => !value)} />
                  <div className={styles.rowEnd}>
                    <button className={styles.linkButton} type="button" onClick={handleForgotPassword}>
                      Забыли пароль?
                    </button>
                  </div>
                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Входим..." : "Войти"}
                  </button>
                  <div className={styles.divider}>или</div>
                  <button className={styles.secondaryButton} type="button" onClick={handlePhoneLoginStart}>
                    <Phone size={20} aria-hidden="true" />
                    Войти по номеру телефона
                  </button>
                </form>
              </div>
            ) : null}

            {activeTab === "login" && phoneLoginMode ? (
              <div className={styles.formPanel} key="phone-login">
                <div className={styles.formHeader}>
                  <h2>Вход по номеру телефона</h2>
                  <p>Введите номер, указанный при регистрации, и пароль от аккаунта.</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handlePhoneSubmit}>
                  <div className={styles.fieldWrap}>
                    <Phone className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="tel" value={phoneOnly} onChange={(e) => setPhoneOnly(sanitizeText(e.target.value, 24))} placeholder="+7 (___) ___-__-__" aria-label="Телефон для входа" autoComplete="tel" />
                  </div>
                  <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" ariaLabel="Пароль" visible={showLoginPassword} onToggle={() => setShowLoginPassword((value) => !value)} />
                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Входим..." : "Войти по номеру"}
                  </button>
                  <button className={styles.backButton} type="button" onClick={() => { setPhoneLoginMode(false); resetMessages(); }}>
                    Вернуться
                  </button>
                </form>
              </div>
            ) : null}

            {activeTab === "register" ? (
              <div className={styles.formPanel} key="register">
                <div className={styles.formHeader}>
                  <h2>{accountType === "vendor" ? "Создайте vendor кабинет" : "Создайте аккаунт"}</h2>
                  <p>{accountType === "vendor" ? "После регистрации профиль попадет на проверку администратору" : "Начните организовывать ваш той уже сегодня"}</p>
                </div>
                {message}
                <form className={styles.form} onSubmit={handleRegister}>
                  <div className={styles.fieldWrap}>
                    <User className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="text" value={name} onChange={(e) => setName(sanitizeText(e.target.value, 80))} placeholder="Ваше имя" aria-label="Имя" autoComplete="name" />
                  </div>
                  <div className={styles.fieldWrap}>
                    <Mail className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(sanitizeText(e.target.value, 254))} placeholder="Email" aria-label="Email" autoComplete="email" />
                  </div>
                  <div className={styles.fieldWrap}>
                    <Phone className={styles.fieldIcon} size={20} aria-hidden="true" />
                    <input className={styles.input} type="tel" value={registerPhone} onChange={(e) => setRegisterPhone(sanitizeText(e.target.value, 24))} placeholder="+7 (___) ___-__-__" aria-label="Телефон" autoComplete="tel" />
                  </div>
                  {accountType === "client" ? (
                    <div className={styles.fieldWrap}>
                      <MapPin className={styles.fieldIcon} size={19} aria-hidden="true" />
                      <select className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} aria-label="Город">
                        {KZ_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className={styles.gridFields}>
                      <div className={styles.fieldWrap}>
                        <MapPin className={styles.fieldIcon} size={19} aria-hidden="true" />
                        <select className={styles.input} value={city} onChange={(e) => setCity(e.target.value)} aria-label="Город">
                          {KZ_CITIES.map((item) => <option key={item} value={item}>{item}</option>)}
                        </select>
                      </div>
                      <select className={`${styles.input} ${styles.inputPlain}`} value={vendorCategory} onChange={(e) => setVendorCategory(e.target.value)} aria-label="Категория услуги">
                        {CATEGORIES.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                      </select>
                    </div>
                  )}
                  {accountType === "vendor" ? (
                    <>
                      <div className={styles.fieldWrap}>
                        <Building2 className={styles.fieldIcon} size={20} aria-hidden="true" />
                        <input className={styles.input} type="text" value={businessName} onChange={(e) => setBusinessName(sanitizeText(e.target.value, 120))} placeholder="Название бизнеса" aria-label="Название бизнеса" />
                      </div>
                      <div className={styles.gridFields}>
                        <input className={`${styles.input} ${styles.inputPlain}`} value={instagram} onChange={(e) => setInstagram(sanitizeText(e.target.value, 80))} placeholder="Instagram optional" aria-label="Instagram" />
                        <input className={`${styles.input} ${styles.inputPlain}`} value={whatsapp} onChange={(e) => setWhatsapp(sanitizeText(e.target.value, 32))} placeholder="WhatsApp optional" aria-label="WhatsApp" />
                      </div>
                    </>
                  ) : null}
                  <PasswordField value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Придумайте пароль" ariaLabel="Придумайте пароль" visible={showRegisterPassword} onToggle={() => setShowRegisterPassword((value) => !value)} autoComplete="new-password" />
                  <PasswordField value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Повторите пароль" ariaLabel="Повторите пароль" visible={showConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} autoComplete="new-password" />
                  <button className={styles.primaryButton} type="submit" disabled={submitting}>
                    {submitting ? "Создаем..." : accountType === "vendor" ? "Отправить на проверку" : "Зарегистрироваться"}
                  </button>
                </form>
              </div>
            ) : null}

            <button className={styles.adminLink} type="button" onClick={() => router.push("/admin/login")}>
              <ShieldCheck size={16} aria-hidden="true" />
              Админ вход
            </button>

            <div className={styles.features} aria-label="Возможности toi.kz">
              <div className={styles.feature}>
                <span className={styles.featureIcon}><Calendar size={22} aria-hidden="true" /></span>
                <span><span className={styles.featureTitle}>Планируйте</span><span className={styles.featureSubtitle}>все этапы тоя</span></span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}><Users size={22} aria-hidden="true" /></span>
                <span><span className={styles.featureTitle}>Приглашайте</span><span className={styles.featureSubtitle}>гостей легко</span></span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}><Heart size={22} aria-hidden="true" /></span>
                <span><span className={styles.featureTitle}>Создавайте</span><span className={styles.featureSubtitle}>впечатления</span></span>
              </div>
            </div>
          </div>
        </section>
        <footer className={styles.footer}>© 2026 toi.kz — Сделано с любовью в Казахстане ♥</footer>
      </div>
    </main>
  );
}
