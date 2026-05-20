"use client";

import { BOOKING_STATUSES, CATEGORIES, EVENT_TYPES, KZ_CITIES } from "@/lib/appData";
import { useAppStore } from "@/lib/appStore";
import { clearSession, getSession, setSession, updateSession } from "@/lib/session";
import { isValidEmail, isValidKazakhstanPhone, normalizeEmail, normalizePhone, sanitizeText } from "@/lib/sanitize";
import { useToast } from "@/components/Toast";
import { auth, db } from "@/lib/firebase";
import { findEmailByPhone, writePhoneLoginIndex } from "@/lib/authLookups";
import { isAdmin } from "@/lib/roles";
import { get, ref } from "firebase/database";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  Camera,
  Check,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Eye,
  FileText,
  Filter,
  Heart,
  Home,
  ListChecks,
  LogOut,
  MapPin,
  MessageCircle,
  Music,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Star,
  Table2,
  Trash2,
  User,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const RELATIONS = ["туыс", "дос", "әріптес", "құда жақ", "қыз жақ", "жігіт жақ"];
const GUEST_STATUSES = {
  invited: "Шақырылды",
  coming: "Келеді",
  declined: "Келмейді",
  unknown: "Жауап жоқ",
};

function formatMoney(value) {
  return `${new Intl.NumberFormat("ru-KZ").format(Number(value || 0))} ₸`;
}

function daysUntil(date) {
  if (!date) return 0;
  const diff = new Date(`${date}T12:00:00`).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function statusTone(status) {
  if (["confirmed", "depositPaid", "completed", "approved", "active"].includes(status)) return "success";
  if (["pending", "pendingApproval", "open"].includes(status)) return "warning";
  if (["cancelled", "declined", "rejected", "blocked"].includes(status)) return "danger";
  return "";
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className={`modal-sheet ${wide ? "wide" : ""}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="close-button" type="button" onClick={onClose} aria-label="Закрыть">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function SectionHead({ title, text, action }) {
  return (
    <div className="section-head">
      <div>
        <h2>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="stat-card">
      <Icon size={22} aria-hidden="true" />
      <strong style={{ color: tone || "white" }}>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <strong style={{ display: "block", color: "white", marginBottom: 6 }}>{title}</strong>
      <span>{text}</span>
      {action ? <div style={{ marginTop: 16 }}>{action}</div> : null}
    </div>
  );
}

function StatusPill({ status, children }) {
  return <span className={`status-pill ${statusTone(status)}`}>{children || BOOKING_STATUSES[status] || status}</span>;
}

export function ClientHomePage() {
  const router = useRouter();
  const showToast = useToast();
  const session = getSession() || {};
  const { store, currentEvent, addEvent, markNotificationsRead } = useAppStore();
  const event = currentEvent;
  const notifications = store.notifications[session.uid] || [];
  const unread = notifications.filter((item) => item.unread).length;
  const bookings = store.bookings.filter((item) => item.clientId === session.uid || item.clientId === "client_demo").slice(0, 3);
  const recommended = store.vendors.filter((vendor) => vendor.status === "approved" && vendor.featured).slice(0, 3);

  const quickActions = [
    { label: "Найти зал", icon: Building2, action: () => router.push("/menu/halls?category=Залы") },
    { label: "Добавить гостей", icon: Users, action: () => router.push("/menu/plan?tab=guests") },
    { label: "Создать приглашение", icon: Send, action: () => router.push("/menu/plan?tab=invites") },
    { label: "Рассчитать бюджет", icon: Wallet, action: () => router.push("/menu/plan?tab=budget") },
  ];

  function handleCreateEvent() {
    const created = addEvent({
      title: "Мой той",
      city: session.city || "Алматы",
      type: "Той",
      date: "2026-09-12",
      guestCount: 100,
    });
    showToast("Мероприятие создано");
    router.push(`/menu/plan?event=${created.id}`);
  }

  return (
    <div className="page-stack">
      <section className="hero-card premium-card">
        <span className="status-pill success">Для пользователей бесплатно</span>
        <h2>{event ? `До вашего тоя осталось ${daysUntil(event.date)} дней` : "Организуйте той без лишнего стресса"}</h2>
        <p>{event ? `${event.title} · ${event.city} · ${event.guestCount} гостей. Готовность подготовки: ${event.progress}%.` : "Создайте мероприятие, подберите услуги, ведите гостей и бюджет в одном premium PWA."}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
          <button className="premium-button" type="button" onClick={() => (event ? router.push("/menu/plan") : handleCreateEvent())}>
            {event ? "Продолжить подготовку" : "Начать планирование"}
            <ChevronRight size={18} />
          </button>
          <button className="secondary-button" type="button" onClick={() => router.push("/menu/halls")}>
            Открыть каталог
          </button>
        </div>
      </section>

      <div className="grid-4">
        <StatCard icon={CalendarDays} label="Дата" value={event?.date || "Не выбрана"} />
        <StatCard icon={Users} label="Гостей" value={event?.guestCount || 0} />
        <StatCard icon={Wallet} label="Бюджет" value={formatMoney(event?.budget)} />
        <StatCard icon={Bell} label="Новых уведомлений" value={unread} tone={unread ? "#f0d391" : undefined} />
      </div>

      <section className="premium-card premium-card-inner">
        <div className="list-row">
          <div>
            <h3 style={{ margin: 0 }}>Быстрые действия</h3>
            <p className="muted" style={{ margin: "6px 0 0" }}>Самые частые сценарии в один тап.</p>
          </div>
          <button className="ghost-button" type="button" onClick={() => { markNotificationsRead(session.uid); showToast("Уведомления отмечены прочитанными"); }}>
            Прочитать все
          </button>
        </div>
        <div className="grid-4" style={{ marginTop: 18 }}>
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.label} className="secondary-button" type="button" style={{ minHeight: 88, flexDirection: "column" }} onClick={item.action}>
                <Icon size={24} />
                {item.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid-2">
        <section className="premium-card premium-card-inner">
          <SectionHead title="Следующие задачи" text="Список уже предзаполнен под той." action={<button className="ghost-button" type="button" onClick={() => router.push("/menu/plan?tab=checklist")}>Открыть</button>} />
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {(store.checklist[event?.id] || []).slice(0, 4).map((task) => (
              <div className="list-row" key={task.id}>
                <span className={task.done ? "muted" : ""}>{task.title}</span>
                <StatusPill status={task.done ? "completed" : "pending"}>{task.done ? "Готово" : task.group}</StatusPill>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card premium-card-inner">
          <SectionHead title="Ваши брони" text="Заявки и подтверждения." action={<button className="ghost-button" type="button" onClick={() => router.push("/menu/booking")}>Все</button>} />
          <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
            {bookings.length ? bookings.map((booking) => (
              <div className="list-row" key={booking.id}>
                <div>
                  <strong>{booking.serviceName}</strong>
                  <div className="muted" style={{ fontSize: 13 }}>{booking.date} · {booking.guests} гостей</div>
                </div>
                <StatusPill status={booking.status} />
              </div>
            )) : <EmptyState title="Броней пока нет" text="Выберите vendor в каталоге и отправьте заявку." />}
          </div>
        </section>
      </div>

      <section className="premium-card premium-card-inner">
        <SectionHead title="Рекомендовано вам" text="Проверенные vendor-профили с высоким рейтингом." />
        <div className="grid-3" style={{ marginTop: 16 }}>
          {recommended.map((vendor) => (
            <article className="vendor-card premium-card" key={vendor.id}>
              <div className="vendor-card-image">
                <img src={vendor.image} alt={vendor.businessName} />
              </div>
              <div className="vendor-card-body">
                <div className="list-row">
                  <h3>{vendor.businessName}</h3>
                  <StatusPill status="approved"><ShieldCheck size={14} /> verified</StatusPill>
                </div>
                <span className="muted">{vendor.category} · {vendor.city}</span>
                <div className="list-row">
                  <strong>{formatMoney(vendor.priceFrom)} бастап</strong>
                  <span className="chip"><Star size={14} /> {vendor.rating}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-card premium-card-inner">
        <SectionHead title="Типы мероприятий" text="Подходит для казахстанских семейных и бизнес-мероприятий." />
        <div className="scroll-row" style={{ marginTop: 16 }}>
          {EVENT_TYPES.map((type) => (
            <button className="chip" type="button" key={type} onClick={() => showToast(`${type}: подбор скоро будет персонализирован`)}>
              {type}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CatalogPage() {
  const showToast = useToast();
  const { store, currentEvent, addBooking } = useAppStore();
  const session = getSession() || {};
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [city, setCity] = useState("Все");
  const [sort, setSort] = useState("popular");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [bookingVendor, setBookingVendor] = useState(null);
  const [compare, setCompare] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    date: "",
    time: "18:00",
    guests: currentEvent?.guestCount || 100,
    eventType: currentEvent?.type || "Той",
    phone: session.phone || "",
    comment: "",
  });

  const vendors = useMemo(() => {
    const text = query.trim().toLowerCase();
    const filtered = store.vendors
      .filter((vendor) => vendor.status === "approved")
      .filter((vendor) => category === "Все" || vendor.category === category)
      .filter((vendor) => city === "Все" || vendor.city === city)
      .filter((vendor) => !verifiedOnly || vendor.verified)
      .filter((vendor) => !text || `${vendor.businessName} ${vendor.category} ${vendor.city}`.toLowerCase().includes(text));

    return filtered.sort((a, b) => {
      if (sort === "price") return (a.priceFrom || 0) - (b.priceFrom || 0);
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
      return Number(b.featured) - Number(a.featured) || (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [category, city, query, sort, store.vendors, verifiedOnly]);

  function openBooking(vendor) {
    setBookingVendor(vendor);
    setBookingForm((current) => ({
      ...current,
      eventType: currentEvent?.type || "Той",
      guests: currentEvent?.guestCount || current.guests,
      phone: session.phone || current.phone,
    }));
  }

  function submitBooking(e) {
    e.preventDefault();
    const phone = normalizePhone(bookingForm.phone);

    if (!bookingForm.date || !bookingForm.time || !bookingForm.guests || !isValidKazakhstanPhone(phone)) {
      showToast("Заполните дату, время, гостей и корректный телефон");
      return;
    }

    const booking = addBooking({
      clientId: session.uid,
      vendorId: bookingVendor.id,
      serviceId: `service_${bookingVendor.id}`,
      eventId: currentEvent?.id || "event-main",
      serviceName: bookingVendor.businessName,
      vendorName: bookingVendor.businessName,
      date: bookingForm.date,
      time: bookingForm.time,
      guests: Number(bookingForm.guests),
      eventType: bookingForm.eventType,
      price: Number(bookingVendor.priceFrom || 0) * Number(bookingForm.guests || 1),
      deposit: Math.round(Number(bookingVendor.priceFrom || 0) * Number(bookingForm.guests || 1) * 0.1),
      comment: sanitizeText(bookingForm.comment, 400),
      contactPhone: phone,
    });

    setBookingVendor(null);
    showToast(`Заявка #${booking.id.slice(-5)} отправлена`);
  }

  function toggleCompare(vendor) {
    setCompare((current) => {
      if (current.includes(vendor.id)) return current.filter((id) => id !== vendor.id);
      if (current.length >= 3) {
        showToast("Можно сравнить до 3 вариантов");
        return current;
      }
      showToast("Добавлено к сравнению");
      return [...current, vendor.id];
    });
  }

  return (
    <div className="page-stack">
      <SectionHead
        title="Каталог услуг"
        text="Залы, рестораны, тамада, фото, видео, декор и другие услуги для тоя."
        action={<span className="status-pill success">{vendors.length} проверенных профилей</span>}
      />

      <section className="premium-card premium-card-inner">
        <div className="field-grid">
          <label>
            <span className="chip" style={{ marginBottom: 8 }}><Search size={14} /> Поиск</span>
            <input className="premium-input" value={query} onChange={(e) => setQuery(sanitizeText(e.target.value, 80))} placeholder="Название, категория, город" aria-label="Поиск" />
          </label>
          <label>
            <span className="chip" style={{ marginBottom: 8 }}><Filter size={14} /> Категория</span>
            <select className="premium-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Категория">
              <option>Все</option>
              {CATEGORIES.map((item) => <option key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            <span className="chip" style={{ marginBottom: 8 }}><MapPin size={14} /> Город</span>
            <select className="premium-select" value={city} onChange={(e) => setCity(e.target.value)} aria-label="Город">
              <option>Все</option>
              {KZ_CITIES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="chip" style={{ marginBottom: 8 }}><Star size={14} /> Сортировка</span>
            <select className="premium-select" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Сортировка">
              <option value="popular">Популярные</option>
              <option value="rating">Рейтинг</option>
              <option value="price">Цена</option>
              <option value="newest">Новые</option>
            </select>
          </label>
        </div>
        <label className="list-row" style={{ justifyContent: "flex-start", marginTop: 14 }}>
          <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
          <span>Только verified</span>
        </label>
      </section>

      <div className="grid-3">
        {vendors.map((vendor) => (
          <article className="vendor-card premium-card" key={vendor.id}>
            <div className="vendor-card-image">
              <img src={vendor.image} alt={vendor.businessName} />
            </div>
            <div className="vendor-card-body">
              <div className="list-row">
                <h3>{vendor.businessName}</h3>
                {vendor.verified ? <StatusPill status="approved"><ShieldCheck size={14} /> verified</StatusPill> : null}
              </div>
              <span className="muted">{vendor.category} · {vendor.city}{vendor.district ? ` · ${vendor.district}` : ""}</span>
              <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>{vendor.description}</p>
              <div className="scroll-row">
                {(vendor.features || []).slice(0, 5).map((feature) => <span className="chip" key={feature}>{feature}</span>)}
              </div>
              <div className="list-row">
                <strong>{formatMoney(vendor.priceFrom)} бастап</strong>
                <span className="chip"><Star size={14} /> {vendor.rating || "new"}</span>
              </div>
              <div className="grid-2">
                <button className="secondary-button" type="button" onClick={() => setSelected(vendor)}>Подробнее</button>
                <button className="premium-button" type="button" onClick={() => openBooking(vendor)}>Забронировать</button>
              </div>
              <div className="grid-2">
                <button className="ghost-button" type="button" onClick={() => toggleCompare(vendor)}>{compare.includes(vendor.id) ? "В сравнении" : "Сравнить"}</button>
                {vendor.whatsapp ? (
                  <a className="ghost-button" href={`https://wa.me/${vendor.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a>
                ) : (
                  <button className="ghost-button" type="button" onClick={() => showToast("Контакты скоро будут доступны")}>WhatsApp</button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {!vendors.length ? <EmptyState title="Ничего не найдено" text="Попробуйте изменить фильтры или город." /> : null}

      {selected ? (
        <Modal title={selected.businessName} onClose={() => setSelected(null)} wide>
          <div className="page-stack" style={{ gap: 24 }}>
            <div className="grid-2">
              <img src={selected.image} alt={selected.businessName} style={{ borderRadius: 20, width: "100%", height: "100%", minHeight: 300, objectFit: "cover" }} />
              <div className="page-stack">
                <div>
                  <StatusPill status="approved">{selected.category} · {selected.city}</StatusPill>
                  <h2 style={{ margin: "12px 0 8px" }}>{selected.businessName}</h2>
                  <p className="muted" style={{ lineHeight: 1.6 }}>{selected.description}</p>
                </div>
                <div className="grid-2">
                  <StatCard icon={Users} label="Вместимость" value={selected.capacity ? `${selected.capacity}` : "под запрос"} />
                  <StatCard icon={Wallet} label="Цена от" value={formatMoney(selected.priceFrom)} />
                </div>
                <div className="scroll-row">{(selected.features || []).map((feature) => <span className="chip" key={feature}>{feature}</span>)}</div>
                <div className="premium-card premium-card-inner" style={{ background: "rgba(255,255,255,0.035)" }}>
                  <strong>Свободные даты</strong>
                  <div className="scroll-row" style={{ marginTop: 10 }}>{(selected.availableDates || []).map((date) => <span className="chip" key={date}>{date}</span>)}</div>
                </div>
                <div className="grid-2">
                  <button className="premium-button" type="button" onClick={() => { setSelected(null); openBooking(selected); }}>Проверить дату</button>
                  <a className="secondary-button" href={`tel:${selected.phone}`}><Phone size={16} /> Позвонить</a>
                </div>
              </div>
            </div>

            <div className="premium-card premium-card-inner" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16 }}>
              <div className="list-row" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <Star size={20} fill="#f0d391" stroke="#f0d391" /> Отзывы с 2GIS
                </h3>
                {selected.url2gis ? (
                  <a className="secondary-button" href={selected.url2gis} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: "6px 12px" }}>
                    Читать в 2GIS
                  </a>
                ) : null}
              </div>
              
              {selected.reviews && selected.reviews.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {selected.reviews.map((rev, idx) => (
                    <div key={idx} style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="list-row" style={{ marginBottom: 6 }}>
                        <strong style={{ color: "white" }}>{rev.user}</strong>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#f0d391", fontSize: 13 }}>{"★".repeat(rev.rating)}</span>
                          <span className="muted" style={{ fontSize: 12 }}>{rev.date}</span>
                        </div>
                      </div>
                      <p className="muted" style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{rev.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted" style={{ margin: 0, fontSize: 14 }}>Отзывов пока нет.</p>
              )}
            </div>
          </div>
        </Modal>
      ) : null}

      {bookingVendor ? (
        <Modal title={`Бронь: ${bookingVendor.businessName}`} onClose={() => setBookingVendor(null)}>
          <form className="page-stack" onSubmit={submitBooking}>
            <div className="field-grid">
              <input className="premium-input" type="date" value={bookingForm.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} aria-label="Дата" />
              <input className="premium-input" type="time" value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} aria-label="Время" />
              <input className="premium-input" type="number" min="1" value={bookingForm.guests} onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })} placeholder="Гостей" aria-label="Количество гостей" />
              <select className="premium-select" value={bookingForm.eventType} onChange={(e) => setBookingForm({ ...bookingForm, eventType: e.target.value })} aria-label="Тип мероприятия">
                {EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>
            <input className="premium-input" type="tel" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: sanitizeText(e.target.value, 24) })} placeholder="+7 (___) ___-__-__" aria-label="Контактный телефон" />
            <textarea className="premium-textarea" value={bookingForm.comment} onChange={(e) => setBookingForm({ ...bookingForm, comment: sanitizeText(e.target.value, 400) })} placeholder="Комментарий: меню, зона, пожелания" aria-label="Комментарий" />
            <button className="premium-button" type="submit">Отправить заявку</button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

export function BookingsPage() {
  const showToast = useToast();
  const session = getSession() || {};
  const { store, updateBooking } = useAppStore();
  const [selected, setSelected] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const bookings = store.bookings.filter((booking) => booking.clientId === session.uid || booking.clientId === "client_demo");

  return (
    <div className="page-stack">
      <SectionHead title="Бронь" text="Все ваши заявки, подтверждения и депозиты." action={<StatusPill status="pending">{bookings.length} заявок</StatusPill>} />
      <div className="grid-2">
        {bookings.map((booking) => (
          <article className="premium-card list-card" key={booking.id}>
            <div className="list-row">
              <div>
                <h3>{booking.serviceName}</h3>
                <p className="muted" style={{ margin: "6px 0 0" }}>{booking.vendorName} · {booking.date} · {booking.time}</p>
              </div>
              <StatusPill status={booking.status} />
            </div>
            <div className="grid-3">
              <StatCard icon={Users} label="Гостей" value={booking.guests} />
              <StatCard icon={Wallet} label="Сумма" value={formatMoney(booking.price)} />
              <StatCard icon={CheckCircle} label="Депозит" value={formatMoney(booking.deposit)} />
            </div>
            <div className="grid-2">
              <button className="secondary-button" type="button" onClick={() => setSelected(booking)}>Подробнее</button>
              <button className="ghost-button" type="button" onClick={() => showToast("Чат с vendor скоро будет доступен")}>Написать</button>
              <button className="ghost-button" type="button" onClick={() => showToast("Изменение заявки скоро будет доступно")}>Изменить</button>
              <button className="danger-button" type="button" onClick={() => setCancelTarget(booking)}>Отменить</button>
            </div>
          </article>
        ))}
      </div>
      {!bookings.length ? <EmptyState title="Броней пока нет" text="Откройте каталог и отправьте первую заявку." /> : null}

      {selected ? (
        <Modal title="Детали брони" onClose={() => setSelected(null)}>
          <div className="page-stack">
            <StatusPill status={selected.status} />
            <h2 style={{ margin: 0 }}>{selected.serviceName}</h2>
            <p className="muted" style={{ margin: 0 }}>{selected.comment || "Комментарий не указан"}</p>
            <div className="grid-2">
              <StatCard icon={Calendar} label="Дата" value={selected.date} />
              <StatCard icon={Clock} label="Время" value={selected.time} />
              <StatCard icon={Users} label="Гостей" value={selected.guests} />
              <StatCard icon={Phone} label="Телефон" value={selected.contactPhone} />
            </div>
          </div>
        </Modal>
      ) : null}

      {cancelTarget ? (
        <Modal title="Отменить бронь?" onClose={() => setCancelTarget(null)}>
          <p className="muted" style={{ marginTop: 0 }}>Заявка останется в истории со статусом “Отменено”.</p>
          <div className="grid-2">
            <button className="danger-button" type="button" onClick={() => { updateBooking(cancelTarget.id, { status: "cancelled" }); setCancelTarget(null); showToast("Бронь отменена"); }}>Отменить бронь</button>
            <button className="secondary-button" type="button" onClick={() => setCancelTarget(null)}>Оставить</button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export function PlanPage() {
  const showToast = useToast();
  const router = useRouter();
  const { store, currentEvent, updateList, setStore, uid } = useAppStore();
  const event = currentEvent || store.events[0];
  const eventId = event?.id || "event-main";
  const [tab, setTab] = useState(typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("tab") || "guests" : "guests");
  const [guestForm, setGuestForm] = useState({ name: "", phone: "", relation: "туыс", status: "unknown", plusOne: false, children: 0 });
  const [expenseForm, setExpenseForm] = useState({ category: "зал", title: "", planned: "", actual: "", paid: false });
  const [taskTitle, setTaskTitle] = useState("");
  const [tableForm, setTableForm] = useState({ name: "", capacity: 10, note: "" });
  const [assignGuest, setAssignGuest] = useState("");
  const [assignTable, setAssignTable] = useState("");
  const [timelineForm, setTimelineForm] = useState({ time: "", title: "", responsible: "", note: "" });

  const guests = store.guests[eventId] || [];
  const budget = store.budget[eventId] || [];
  const checklist = store.checklist[eventId] || [];
  const tables = store.tables[eventId] || [];
  const timeline = store.timeline[eventId] || [];
  const invitation = store.invitations[eventId] || {};
  const tabs = [
    ["guests", "Гости", Users],
    ["invites", "Приглашения", Send],
    ["budget", "Бюджет", Wallet],
    ["checklist", "Чеклист", ListChecks],
    ["seating", "Рассадка", Table2],
    ["timeline", "Тайминг", Clock],
  ];

  const guestStats = {
    total: guests.length,
    coming: guests.filter((guest) => guest.status === "coming").length,
    declined: guests.filter((guest) => guest.status === "declined").length,
    unknown: guests.filter((guest) => guest.status === "unknown").length,
  };
  const planned = budget.reduce((sum, item) => sum + Number(item.planned || 0), 0);
  const actual = budget.reduce((sum, item) => sum + Number(item.actual || 0), 0);
  const doneTasks = checklist.filter((task) => task.done).length;

  function addGuest(e) {
    e.preventDefault();
    const name = sanitizeText(guestForm.name, 80);
    const phone = normalizePhone(guestForm.phone);
    if (!name || (guestForm.phone && !isValidKazakhstanPhone(phone))) {
      showToast("Введите имя и корректный телефон");
      return;
    }
    updateList("guests", eventId, [{ ...guestForm, id: uid("guest"), name, phone }, ...guests]);
    setGuestForm({ name: "", phone: "", relation: "туыс", status: "unknown", plusOne: false, children: 0 });
    showToast("Гость добавлен");
  }

  function addExpense(e) {
    e.preventDefault();
    const title = sanitizeText(expenseForm.title, 80);
    if (!title || !expenseForm.planned) {
      showToast("Укажите название и плановую сумму");
      return;
    }
    updateList("budget", eventId, [{ ...expenseForm, id: uid("expense"), planned: Number(expenseForm.planned), actual: Number(expenseForm.actual || 0) }, ...budget]);
    setExpenseForm({ category: "зал", title: "", planned: "", actual: "", paid: false });
    showToast("Расход добавлен");
  }

  function addTask(e) {
    e.preventDefault();
    const title = sanitizeText(taskTitle, 120);
    if (!title) return;
    updateList("checklist", eventId, [{ id: uid("task"), group: "custom", title, done: false, dueDate: "", reminder: false }, ...checklist]);
    setTaskTitle("");
  }

  function addTable(e) {
    e.preventDefault();
    const name = sanitizeText(tableForm.name, 60);
    if (!name) return;
    updateList("tables", eventId, [{ ...tableForm, id: uid("table"), name, capacity: Number(tableForm.capacity || 10) }, ...tables]);
    setTableForm({ name: "", capacity: 10, note: "" });
  }

  function assignSeat(e) {
    e.preventDefault();
    if (!assignGuest || !assignTable) return;
    updateList("guests", eventId, guests.map((guest) => (guest.id === assignGuest ? { ...guest, tableId: assignTable } : guest)));
    setAssignGuest("");
    setAssignTable("");
    showToast("Гость посажен за стол");
  }

  function addTimeline(e) {
    e.preventDefault();
    const title = sanitizeText(timelineForm.title, 120);
    if (!timelineForm.time || !title) return;
    updateList("timeline", eventId, [{ ...timelineForm, id: uid("timeline"), title }, ...timeline].sort((a, b) => a.time.localeCompare(b.time)));
    setTimelineForm({ time: "", title: "", responsible: "", note: "" });
  }

  function updateInvitation(patch) {
    setStore((current) => ({
      ...current,
      invitations: { ...current.invitations, [eventId]: { ...invitation, ...patch } },
    }));
  }

  return (
    <div className="page-stack">
      <SectionHead title="План" text={`${event?.title || "Мероприятие"} · гости, приглашения, бюджет, чеклист, рассадка и тайминг.`} />
      <div className="scroll-row">
        {tabs.map(([id, label, Icon]) => (
          <button key={id} className={tab === id ? "premium-button" : "secondary-button"} type="button" onClick={() => setTab(id)}>
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {tab === "guests" ? (
        <>
          <div className="grid-4">
            <StatCard icon={Users} label="Барлығы" value={guestStats.total} />
            <StatCard icon={CheckCircle} label="Келеді" value={guestStats.coming} />
            <StatCard icon={X} label="Келмейді" value={guestStats.declined} />
            <StatCard icon={Clock} label="Жауап жоқ" value={guestStats.unknown} />
          </div>
          <section className="premium-card premium-card-inner">
            <form className="field-grid" onSubmit={addGuest}>
              <input className="premium-input" value={guestForm.name} onChange={(e) => setGuestForm({ ...guestForm, name: sanitizeText(e.target.value, 80) })} placeholder="Аты-жөні" aria-label="Имя гостя" />
              <input className="premium-input" value={guestForm.phone} onChange={(e) => setGuestForm({ ...guestForm, phone: sanitizeText(e.target.value, 24) })} placeholder="+7..." aria-label="Телефон гостя" />
              <select className="premium-select" value={guestForm.relation} onChange={(e) => setGuestForm({ ...guestForm, relation: e.target.value })} aria-label="Отношение">
                {RELATIONS.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select className="premium-select" value={guestForm.status} onChange={(e) => setGuestForm({ ...guestForm, status: e.target.value })} aria-label="Статус">
                {Object.entries(GUEST_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              <label className="list-row" style={{ justifyContent: "flex-start" }}><input type="checkbox" checked={guestForm.plusOne} onChange={(e) => setGuestForm({ ...guestForm, plusOne: e.target.checked })} /> Plus one</label>
              <input className="premium-input" type="number" min="0" value={guestForm.children} onChange={(e) => setGuestForm({ ...guestForm, children: e.target.value })} placeholder="Балалар саны" aria-label="Количество детей" />
              <button className="premium-button" type="submit"><Plus size={16} /> Добавить гостя</button>
            </form>
          </section>
          <section className="premium-card table-wrap">
            <table className="premium-table">
              <thead><tr><th>Гость</th><th>Телефон</th><th>Қатынас</th><th>Статус</th><th>Стол</th><th></th></tr></thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td>{guest.name}</td>
                    <td>{guest.phone}</td>
                    <td>{guest.relation}</td>
                    <td>
                      <select className="premium-select" value={guest.status} onChange={(e) => updateList("guests", eventId, guests.map((item) => item.id === guest.id ? { ...item, status: e.target.value } : item))}>
                        {Object.entries(GUEST_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                      </select>
                    </td>
                    <td>{tables.find((table) => table.id === guest.tableId)?.name || "—"}</td>
                    <td><button className="danger-button" type="button" onClick={() => updateList("guests", eventId, guests.filter((item) => item.id !== guest.id))}><Trash2 size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}

      {tab === "invites" ? (
        <section className="premium-card premium-card-inner">
          <div className="field-grid">
            {["bride", "groom", "venue", "address", "dressCode", "timing"].map((field) => (
              <input key={field} className="premium-input" value={invitation[field] || ""} onChange={(e) => updateInvitation({ [field]: sanitizeText(e.target.value, 140) })} placeholder={{ bride: "Bride name", groom: "Groom name", venue: "Venue", address: "Address", dressCode: "Dress code", timing: "Timing" }[field]} aria-label={field} />
            ))}
            <select className="premium-select" value={invitation.template || "dark premium"} onChange={(e) => updateInvitation({ template: e.target.value })} aria-label="Шаблон">
              {["modern", "қазақы", "luxury", "minimal", "floral", "dark premium"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="list-row" style={{ justifyContent: "flex-start" }}><input type="checkbox" checked={invitation.rsvpEnabled !== false} onChange={(e) => updateInvitation({ rsvpEnabled: e.target.checked })} /> RSVP enabled</label>
          </div>
          <textarea className="premium-textarea" style={{ marginTop: 12 }} value={invitation.message || ""} onChange={(e) => updateInvitation({ message: sanitizeText(e.target.value, 300) })} placeholder="Custom message" aria-label="Сообщение" />
          <div className="premium-card premium-card-inner" style={{ marginTop: 16, background: "rgba(255,255,255,0.035)" }}>
            <strong>Public RSVP link</strong>
            <p className="muted">{typeof window !== "undefined" ? `${window.location.origin}/invite/${eventId}` : `/invite/${eventId}`}</p>
            <div className="grid-2">
              <button className="premium-button" type="button" onClick={() => { navigator.clipboard?.writeText(`${window.location.origin}/invite/${eventId}`); showToast("Ссылка скопирована"); }}>Скопировать ссылку</button>
              <a className="secondary-button" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`Сізді тойымызға шақырамыз: ${typeof window !== "undefined" ? `${window.location.origin}/invite/${eventId}` : ""}`)}`}>Share WhatsApp</a>
            </div>
          </div>
        </section>
      ) : null}

      {tab === "budget" ? (
        <>
          <div className="grid-3">
            <StatCard icon={Wallet} label="Жоспар" value={formatMoney(planned)} />
            <StatCard icon={CheckCircle} label="Төленді" value={formatMoney(actual)} />
            <StatCard icon={BarChart3} label="Қалды" value={formatMoney(planned - actual)} />
          </div>
          <section className="premium-card premium-card-inner">
            <form className="field-grid" onSubmit={addExpense}>
              <select className="premium-select" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>{["зал", "тамада", "фото/видео", "декор", "әнші", "көлік", "көйлек/костюм", "макияж", "шақыру", "торт", "сыйлықтар", "қосымша шығындар"].map((item) => <option key={item}>{item}</option>)}</select>
              <input className="premium-input" value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: sanitizeText(e.target.value, 80) })} placeholder="Название" />
              <input className="premium-input" type="number" value={expenseForm.planned} onChange={(e) => setExpenseForm({ ...expenseForm, planned: e.target.value })} placeholder="План" />
              <input className="premium-input" type="number" value={expenseForm.actual} onChange={(e) => setExpenseForm({ ...expenseForm, actual: e.target.value })} placeholder="Факт" />
              <label className="list-row" style={{ justifyContent: "flex-start" }}><input type="checkbox" checked={expenseForm.paid} onChange={(e) => setExpenseForm({ ...expenseForm, paid: e.target.checked })} /> paid</label>
              <button className="premium-button" type="submit"><Plus size={16} /> Добавить расход</button>
            </form>
          </section>
          <div className="grid-2">{budget.map((item) => <article className="premium-card list-card" key={item.id}><div className="list-row"><div><h3>{item.title}</h3><span className="muted">{item.category}</span></div><StatusPill status={item.paid ? "completed" : "pending"}>{item.paid ? "paid" : "unpaid"}</StatusPill></div><div className="list-row"><strong>{formatMoney(item.actual || item.planned)}</strong><button className="danger-button" type="button" onClick={() => updateList("budget", eventId, budget.filter((expense) => expense.id !== item.id))}><Trash2 size={15} /></button></div></article>)}</div>
        </>
      ) : null}

      {tab === "checklist" ? (
        <section className="premium-card premium-card-inner">
          <div className="list-row">
            <div><strong>Progress {doneTasks}/{checklist.length}</strong><div className="progress-track" style={{ width: 220, marginTop: 10 }}><div className="progress-fill" style={{ width: `${checklist.length ? (doneTasks / checklist.length) * 100 : 0}%` }} /></div></div>
            <form style={{ display: "flex", gap: 10 }} onSubmit={addTask}><input className="premium-input" value={taskTitle} onChange={(e) => setTaskTitle(sanitizeText(e.target.value, 120))} placeholder="Custom task" /><button className="premium-button" type="submit"><Plus size={16} /></button></form>
          </div>
          <div className="page-stack" style={{ marginTop: 18 }}>{checklist.map((task) => <div className="list-row" key={task.id}><label style={{ display: "flex", gap: 12, alignItems: "center" }}><input type="checkbox" checked={task.done} onChange={(e) => updateList("checklist", eventId, checklist.map((item) => item.id === task.id ? { ...item, done: e.target.checked } : item))} /><span>{task.title}</span></label><StatusPill status={task.done ? "completed" : "pending"}>{task.group}</StatusPill></div>)}</div>
        </section>
      ) : null}

      {tab === "seating" ? (
        <>
          <div className="grid-3">
            <StatCard icon={Table2} label="Столдар" value={tables.length} />
            <StatCard icon={CheckCircle} label="Отырғызылды" value={guests.filter((guest) => guest.tableId).length} />
            <StatCard icon={Users} label="Орынсыз" value={guests.filter((guest) => !guest.tableId).length} />
          </div>
          <section className="premium-card premium-card-inner">
            <form className="field-grid" onSubmit={addTable}><input className="premium-input" value={tableForm.name} onChange={(e) => setTableForm({ ...tableForm, name: sanitizeText(e.target.value, 60) })} placeholder="Table name" /><input className="premium-input" type="number" min="1" value={tableForm.capacity} onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })} placeholder="Capacity" /><input className="premium-input" value={tableForm.note} onChange={(e) => setTableForm({ ...tableForm, note: sanitizeText(e.target.value, 120) })} placeholder="Conflict note" /><button className="premium-button" type="submit">Add table</button></form>
          </section>
          <section className="premium-card premium-card-inner">
            <form className="field-grid" onSubmit={assignSeat}><select className="premium-select" value={assignGuest} onChange={(e) => setAssignGuest(e.target.value)}><option value="">Guest</option>{guests.map((guest) => <option key={guest.id} value={guest.id}>{guest.name}</option>)}</select><select className="premium-select" value={assignTable} onChange={(e) => setAssignTable(e.target.value)}><option value="">Table</option>{tables.map((table) => <option key={table.id} value={table.id}>{table.name}</option>)}</select><button className="premium-button" type="submit">Assign</button></form>
          </section>
          <div className="grid-2">{tables.map((table) => <article className="premium-card list-card" key={table.id}><div className="list-row"><h3>{table.name}</h3><StatusPill status="pending">{guests.filter((guest) => guest.tableId === table.id).length}/{table.capacity}</StatusPill></div><p className="muted">{table.note || "Conflict note жоқ"}</p><div className="scroll-row">{guests.filter((guest) => guest.tableId === table.id).map((guest) => <span className="chip" key={guest.id}>{guest.name}</span>)}</div></article>)}</div>
        </>
      ) : null}

      {tab === "timeline" ? (
        <>
          <section className="premium-card premium-card-inner">
            <form className="field-grid" onSubmit={addTimeline}><input className="premium-input" type="time" value={timelineForm.time} onChange={(e) => setTimelineForm({ ...timelineForm, time: e.target.value })} /><input className="premium-input" value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: sanitizeText(e.target.value, 120) })} placeholder="Title" /><input className="premium-input" value={timelineForm.responsible} onChange={(e) => setTimelineForm({ ...timelineForm, responsible: sanitizeText(e.target.value, 80) })} placeholder="Responsible" /><input className="premium-input" value={timelineForm.note} onChange={(e) => setTimelineForm({ ...timelineForm, note: sanitizeText(e.target.value, 140) })} placeholder="Note" /><button className="premium-button" type="submit">Add item</button></form>
          </section>
          <div className="page-stack">{timeline.map((item) => <article className="premium-card list-card" key={item.id}><div className="list-row"><div><h3>{item.time} — {item.title}</h3><p className="muted" style={{ margin: "6px 0 0" }}>{item.responsible} · {item.note}</p></div><button className="danger-button" type="button" onClick={() => updateList("timeline", eventId, timeline.filter((row) => row.id !== item.id))}><Trash2 size={15} /></button></div></article>)}</div>
        </>
      ) : null}
    </div>
  );
}

export function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const { store, markNotificationsRead, setStore } = useAppStore();
  const session = getSession() || {};
  const [profile, setProfile] = useState({ name: session.name || "", city: session.city || "Алматы", phone: session.phone || "" });
  const notifications = store.notifications[session.uid] || [];

  async function logout() {
    clearSession();
    try {
      await signOut(auth);
    } catch {
      // Local demo session may not have a Firebase user.
    }
    router.replace("/");
  }

  function saveProfile(e) {
    e.preventDefault();
    const next = updateSession({
      name: sanitizeText(profile.name, 80),
      city: profile.city,
      phone: normalizePhone(profile.phone),
    });
    setStore((current) => ({ ...current, users: current.users.map((user) => user.uid === next.uid ? { ...user, ...next } : user) }));
    showToast("Профиль сохранен");
  }

  return (
    <div className="page-stack">
      <SectionHead title="Профиль" text="Аккаунт, уведомления, язык и настройки безопасности." action={<StatusPill status={session.status || "active"}>{session.role || "client"}</StatusPill>} />
      <div className="grid-2">
        <section className="premium-card premium-card-inner">
          <form className="page-stack" onSubmit={saveProfile}>
            <div className="list-row">
              <img src="/images/toi-logo.png" alt="toi.kz" style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 18, background: "rgba(255,255,255,0.03)" }} />
              <div><h2 style={{ margin: 0 }}>{profile.name || "toi.kz user"}</h2><p className="muted" style={{ margin: "6px 0 0" }}>Для пользователей бесплатно</p></div>
            </div>
            <input className="premium-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: sanitizeText(e.target.value, 80) })} placeholder="Имя" />
            <input className="premium-input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: sanitizeText(e.target.value, 24) })} placeholder="+7..." />
            <select className="premium-select" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })}>{KZ_CITIES.map((city) => <option key={city}>{city}</option>)}</select>
            <button className="premium-button" type="submit">Сохранить</button>
            <button className="danger-button" type="button" onClick={logout}><LogOut size={16} /> Выйти</button>
          </form>
        </section>
        <section className="premium-card premium-card-inner">
          <div className="list-row">
            <h3 style={{ margin: 0 }}>Уведомления</h3>
            <button className="ghost-button" type="button" onClick={() => { markNotificationsRead(session.uid); showToast("Уведомления прочитаны"); }}>Mark read</button>
          </div>
          <div className="page-stack" style={{ marginTop: 16 }}>
            {notifications.length ? notifications.map((item) => <div className="list-card premium-card" key={item.id} style={{ background: item.unread ? "rgba(213,173,98,0.08)" : "rgba(255,255,255,0.03)" }}><strong>{item.title}</strong><span className="muted">{item.text}</span></div>) : <EmptyState title="Нет уведомлений" text="Новые события появятся здесь." />}
          </div>
        </section>
      </div>
    </div>
  );
}

export function VendorSection({ section = "dashboard" }) {
  const showToast = useToast();
  const session = getSession() || {};
  const { store, setStore, updateBooking, uid } = useAppStore();
  const vendor = store.vendors.find((item) => item.ownerId === session.uid) || store.vendors[0];
  const [profile, setProfile] = useState(vendor);
  const [serviceForm, setServiceForm] = useState({ title: "", category: vendor?.category || "Залы", priceFrom: "", city: vendor?.city || "Алматы", description: "" });
  const [busyDate, setBusyDate] = useState("");
  const orders = store.bookings.filter((booking) => booking.vendorId === vendor?.id || booking.vendorName === vendor?.businessName);
  const vendorServices = store.services.filter((service) => service.vendorId === vendor?.id);
  const busyDates = store.busyDates[vendor?.id] || [];

  function saveVendorProfile(e) {
    e.preventDefault();
    setStore((current) => ({
      ...current,
      vendors: current.vendors.map((item) => item.id === vendor.id ? { ...item, ...profile, status: item.status } : item),
    }));
    showToast("Профиль сохранен");
  }

  function addService(e) {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.priceFrom) {
      showToast("Заполните название и цену");
      return;
    }
    setStore((current) => ({
      ...current,
      services: [{ ...serviceForm, id: uid("service"), vendorId: vendor.id, priceFrom: Number(serviceForm.priceFrom), active: true, images: [vendor.image], features: [] }, ...current.services],
    }));
    setServiceForm({ title: "", category: vendor?.category || "Залы", priceFrom: "", city: vendor?.city || "Алматы", description: "" });
  }

  function renderDashboard() {
    return (
      <>
        <div className="grid-4">
          <StatCard icon={Briefcase} label="Новые заявки" value={orders.filter((item) => item.status === "pending").length} />
          <StatCard icon={CheckCircle} label="Подтверждено" value={orders.filter((item) => item.status === "confirmed").length} />
          <StatCard icon={Star} label="Рейтинг" value={vendor?.rating || "new"} />
          <StatCard icon={Eye} label="Просмотры" value="1 248" />
        </div>
        <section className="premium-card premium-card-inner">
          <SectionHead title={vendor?.businessName} text="Кабинет поставщика услуг: заявки, календарь, профиль, отзывы." action={<StatusPill status={vendor?.status}>{vendor?.status === "pending" ? "Ожидает проверки" : "Активен"}</StatusPill>} />
          <div className="progress-track" style={{ marginTop: 18 }}><div className="progress-fill" style={{ width: "72%" }} /></div>
          <p className="muted">Profile completion: 72%</p>
        </section>
      </>
    );
  }

  function renderOrders() {
    return (
      <div className="page-stack">
        {orders.map((order) => <article className="premium-card list-card" key={order.id}><div className="list-row"><div><h3>{order.serviceName}</h3><p className="muted" style={{ margin: "6px 0 0" }}>{order.date} · {order.time} · {order.guests} гостей</p></div><StatusPill status={order.status} /></div><div className="grid-4"><button className="premium-button" onClick={() => { updateBooking(order.id, { status: "confirmed" }); showToast("Заявка принята"); }} type="button">Accept</button><button className="danger-button" onClick={() => updateBooking(order.id, { status: "declined" })} type="button">Decline</button><button className="secondary-button" onClick={() => showToast("Предложение другой даты отправлено")} type="button">Suggest date</button><button className="ghost-button" onClick={() => updateBooking(order.id, { status: "depositPaid" })} type="button">Deposit paid</button></div></article>)}
        {!orders.length ? <EmptyState title="Заявок пока нет" text="Новые заявки из каталога появятся здесь." /> : null}
      </div>
    );
  }

  function renderProfile() {
    return <section className="premium-card premium-card-inner"><form className="page-stack" onSubmit={saveVendorProfile}><input className="premium-input" value={profile.businessName || ""} onChange={(e) => setProfile({ ...profile, businessName: sanitizeText(e.target.value, 120), title: sanitizeText(e.target.value, 120) })} placeholder="Название бизнеса" /><select className="premium-select" value={profile.category || "Залы"} onChange={(e) => setProfile({ ...profile, category: e.target.value })}>{CATEGORIES.map((item) => <option key={item.id}>{item.name}</option>)}</select><select className="premium-select" value={profile.city || "Алматы"} onChange={(e) => setProfile({ ...profile, city: e.target.value })}>{KZ_CITIES.map((city) => <option key={city}>{city}</option>)}</select><input className="premium-input" type="number" value={profile.priceFrom || ""} onChange={(e) => setProfile({ ...profile, priceFrom: Number(e.target.value) })} placeholder="Цена от" /><textarea className="premium-textarea" value={profile.description || ""} onChange={(e) => setProfile({ ...profile, description: sanitizeText(e.target.value, 500) })} placeholder="Описание услуги" /><div className="field-grid"><input className="premium-input" value={profile.whatsapp || ""} onChange={(e) => setProfile({ ...profile, whatsapp: sanitizeText(e.target.value, 32) })} placeholder="WhatsApp" /><input className="premium-input" value={profile.instagram || ""} onChange={(e) => setProfile({ ...profile, instagram: sanitizeText(e.target.value, 80) })} placeholder="Instagram" /></div><button className="premium-button" type="submit">Сохранить профиль</button></form></section>;
  }

  function renderServices() {
    return <div className="page-stack"><section className="premium-card premium-card-inner"><form className="field-grid" onSubmit={addService}><input className="premium-input" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: sanitizeText(e.target.value, 100) })} placeholder="Название услуги" /><select className="premium-select" value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}>{CATEGORIES.map((item) => <option key={item.id}>{item.name}</option>)}</select><input className="premium-input" type="number" value={serviceForm.priceFrom} onChange={(e) => setServiceForm({ ...serviceForm, priceFrom: e.target.value })} placeholder="Цена от" /><select className="premium-select" value={serviceForm.city} onChange={(e) => setServiceForm({ ...serviceForm, city: e.target.value })}>{KZ_CITIES.map((city) => <option key={city}>{city}</option>)}</select><textarea className="premium-textarea" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: sanitizeText(e.target.value, 300) })} placeholder="Описание" /><button className="premium-button" type="submit">Добавить услугу</button></form></section><div className="grid-2">{vendorServices.map((service) => <article className="premium-card list-card" key={service.id}><div className="list-row"><h3>{service.title}</h3><StatusPill status={service.active ? "active" : "cancelled"}>{service.active ? "published" : "hidden"}</StatusPill></div><p className="muted">{service.description}</p><div className="list-row"><strong>{formatMoney(service.priceFrom)}</strong><button className="ghost-button" type="button" onClick={() => setStore((current) => ({ ...current, services: current.services.map((item) => item.id === service.id ? { ...item, active: !item.active } : item) }))}>{service.active ? "Unpublish" : "Publish"}</button></div></article>)}</div></div>;
  }

  function renderCalendar() {
    return <section className="premium-card premium-card-inner"><form className="field-grid" onSubmit={(e) => { e.preventDefault(); if (!busyDate) return; setStore((current) => ({ ...current, busyDates: { ...current.busyDates, [vendor.id]: [...new Set([...(current.busyDates[vendor.id] || []), busyDate])] } })); setBusyDate(""); }}><input className="premium-input" type="date" value={busyDate} onChange={(e) => setBusyDate(e.target.value)} /><button className="premium-button" type="submit">Mark busy</button></form><div className="scroll-row" style={{ marginTop: 18 }}>{busyDates.map((date) => <button className="chip" key={date} type="button" onClick={() => setStore((current) => ({ ...current, busyDates: { ...current.busyDates, [vendor.id]: busyDates.filter((item) => item !== date) } }))}>{date} ×</button>)}</div></section>;
  }

  function renderReviews() {
    return <div className="page-stack">{store.reviews.filter((review) => review.vendorId === vendor?.id).map((review) => <article className="premium-card list-card" key={review.id}><div className="list-row"><strong>{review.author}</strong><span className="chip"><Star size={14} /> {review.rating}</span></div><p className="muted">{review.text}</p><button className="secondary-button" type="button" onClick={() => showToast("Ответ на отзыв сохранен")}>Ответить</button></article>)}<EmptyState title="Отзывы обновляются" text="Новые отзывы клиентов появятся здесь." /></div>;
  }

  function renderMessages() {
    return <div className="page-stack">{store.messages.map((message) => <article className="premium-card list-card" key={message.id}><div className="list-row"><strong>{message.from}</strong>{message.unread ? <StatusPill status="pending">unread</StatusPill> : null}</div><p className="muted">{message.text}</p><button className="secondary-button" type="button" onClick={() => showToast("Сообщение отмечено как прочитанное")}>Ответить</button></article>)}</div>;
  }

  function renderSettings() {
    return <section className="premium-card premium-card-inner"><div className="page-stack"><StatusPill status={vendor?.status}>{vendor?.status}</StatusPill><p className="muted">Vendor access is controlled by Firebase rules and admin approval. UI role is only for routing.</p><button className="secondary-button" type="button" onClick={() => showToast("Настройки уведомлений сохранены")}>Сохранить настройки уведомлений</button></div></section>;
  }

  const titleMap = { dashboard: "Vendor dashboard", orders: "Заявки", profile: "Профиль услуги", services: "Услуги", calendar: "Календарь", reviews: "Отзывы", messages: "Сообщения", settings: "Настройки" };
  const renderMap = { dashboard: renderDashboard, orders: renderOrders, profile: renderProfile, services: renderServices, calendar: renderCalendar, reviews: renderReviews, messages: renderMessages, settings: renderSettings };

  return <div className="page-stack"><SectionHead title={titleMap[section]} text="Кабинет поставщика услуг toi.kz." />{(renderMap[section] || renderDashboard)()}</div>;
}

export function AdminLoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function login(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const safeLoginId = sanitizeText(loginId, 254);
    if (!safeLoginId || password.length < 6) {
      setSubmitting(false);
      setError("Введите email/телефон администратора и пароль");
      return;
    }

    try {
      let loginEmail = "";
      if (safeLoginId.includes("@")) {
        loginEmail = normalizeEmail(safeLoginId);
        if (!isValidEmail(loginEmail)) {
          setSubmitting(false);
          setError("Введите корректный email администратора");
          return;
        }
      } else {
        const safePhone = normalizePhone(safeLoginId);
        if (!isValidKazakhstanPhone(safePhone)) {
          setSubmitting(false);
          setError("Введите корректный телефон администратора");
          return;
        }

        loginEmail = await findEmailByPhone(safePhone);
        if (!loginEmail) {
          setSubmitting(false);
          setError("Неверный логин или пароль");
          return;
        }
      }

      const credential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const allowed = await isAdmin(credential.user.uid);
      if (!allowed) {
        await signOut(auth).catch(() => {});
        clearSession();
        setSubmitting(false);
        setError("Нет доступа к admin panel");
        return;
      }

      const profileSnap = await get(ref(db, `Users/${credential.user.uid}`)).catch(() => null);
      const profile = profileSnap?.exists() ? profileSnap.val() : {};
      const profilePhone = profile?.phoneNumber || profile?.phone || credential.user.phoneNumber || "";
      if (profilePhone) {
        await writePhoneLoginIndex({ phone: profilePhone, email: credential.user.email || loginEmail, uid: credential.user.uid }).catch(() => {});
      }

      const user = {
        uid: credential.user.uid,
        role: "admin",
        name: profile?.name || credential.user.displayName || "Admin toi.kz",
        phone: profilePhone,
        email: credential.user.email || loginEmail,
        emailVerified: credential.user.emailVerified,
        city: profile?.city || "Алматы",
        status: "active",
        createdAt: profile?.createdAt || new Date().toISOString(),
      };
      setSession(user);
      router.replace("/admin");
    } catch {
      setSubmitting(false);
      setError("Неверный логин или пароль");
    }
  }

  return (
    <main className="app-loader" style={{ padding: 18 }}>
      <section className="premium-card premium-card-inner" style={{ width: "min(460px, 94vw)" }}>
        <div className="app-brand" style={{ marginBottom: 20 }}><img className="app-brand-logo" src="/images/toi-logo.png" alt="toi.kz" /><span><strong>TOI.KZ</strong><small>Admin secure entry</small></span></div>
        <form className="page-stack" onSubmit={login}>
          <input className="premium-input" value={loginId} onChange={(e) => setLoginId(sanitizeText(e.target.value, 254))} placeholder="Email или +7..." aria-label="Admin email or phone" autoComplete="username" />
          <input className="premium-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" aria-label="Admin password" />
          {error ? <div className="status-pill danger">{error}</div> : null}
          <button className="premium-button" type="submit" disabled={submitting}>{submitting ? "Проверяем..." : "Войти в admin panel"}</button>
        </form>
      </section>
    </main>
  );
}

export function AdminSection({ section = "dashboard" }) {
  const showToast = useToast();
  const { store, setStore, updateBooking } = useAppStore();
  const pendingVendors = store.vendors.filter((vendor) => vendor.status === "pending");
  const unreadMessages = store.messages.filter((message) => message.unread).length;
  const metrics = [
    [Users, "Пользователи", store.users.length],
    [Briefcase, "Vendors", store.vendors.length],
    [Calendar, "Активные брони", store.bookings.filter((booking) => !["cancelled", "completed"].includes(booking.status)).length],
    [AlertTriangle, "Жалобы", store.complaints.filter((item) => item.status === "open").length],
  ];

  function updateVendor(vendorId, patch) {
    setStore((current) => ({ ...current, vendors: current.vendors.map((vendor) => vendor.id === vendorId ? { ...vendor, ...patch } : vendor) }));
  }

  function renderDashboard() {
    return <><div className="grid-4">{metrics.map(([Icon, label, value]) => <StatCard key={label} icon={Icon} label={label} value={value} />)}</div><div className="grid-2"><section className="premium-card premium-card-inner"><SectionHead title="Ожидают проверки" text="Vendor profiles pending approval." /><div className="page-stack" style={{ marginTop: 16 }}>{pendingVendors.map((vendor) => <div className="list-row" key={vendor.id}><strong>{vendor.businessName}</strong><button className="premium-button" type="button" onClick={() => updateVendor(vendor.id, { status: "approved" })}>Approve</button></div>)}</div></section><section className="premium-card premium-card-inner"><SectionHead title="Unread badges" text="Persisted in local app store for MVP." /><div className="grid-3" style={{ marginTop: 16 }}><StatCard icon={MessageCircle} label="Хабарламалар" value={unreadMessages} /><StatCard icon={FileText} label="Өтінімдер" value={pendingVendors.length} /><StatCard icon={Calendar} label="Сұраныстар" value={store.bookings.filter((b) => b.status === "pending").length} /></div></section></div></>;
  }

  function renderUsers() {
    return <section className="premium-card table-wrap"><table className="premium-table"><thead><tr><th>Имя</th><th>Роль</th><th>Город</th><th>Статус</th><th></th></tr></thead><tbody>{store.users.map((user) => <tr key={user.uid}><td>{user.name}</td><td><select className="premium-select" value={user.role} onChange={(e) => setStore((current) => ({ ...current, users: current.users.map((item) => item.uid === user.uid ? { ...item, role: e.target.value } : item) }))}><option>client</option><option>vendor</option><option>admin</option></select></td><td>{user.city}</td><td><StatusPill status={user.status}>{user.status}</StatusPill></td><td><button className="danger-button" type="button" onClick={() => setStore((current) => ({ ...current, users: current.users.map((item) => item.uid === user.uid ? { ...item, status: item.status === "blocked" ? "active" : "blocked" } : item) }))}>{user.status === "blocked" ? "Unblock" : "Block"}</button></td></tr>)}</tbody></table></section>;
  }

  function renderVendors() {
    return <div className="grid-2">{store.vendors.map((vendor) => <article className="premium-card list-card" key={vendor.id}><div className="list-row"><div><h3>{vendor.businessName}</h3><p className="muted">{vendor.category} · {vendor.city}</p></div><StatusPill status={vendor.status}>{vendor.status}</StatusPill></div><div className="grid-4"><button className="premium-button" type="button" onClick={() => updateVendor(vendor.id, { status: "approved" })}>Approve</button><button className="danger-button" type="button" onClick={() => updateVendor(vendor.id, { status: "rejected" })}>Reject</button><button className="secondary-button" type="button" onClick={() => updateVendor(vendor.id, { verified: !vendor.verified })}>{vendor.verified ? "Unverify" : "Verify"}</button><button className="ghost-button" type="button" onClick={() => updateVendor(vendor.id, { featured: !vendor.featured })}>{vendor.featured ? "Unfeature" : "Feature"}</button></div></article>)}</div>;
  }

  function renderServices() {
    return <section className="premium-card table-wrap"><table className="premium-table"><thead><tr><th>Service</th><th>Category</th><th>City</th><th>Price</th><th>Status</th><th></th></tr></thead><tbody>{store.services.map((service) => <tr key={service.id}><td>{service.title}</td><td>{service.category}</td><td>{service.city}</td><td>{formatMoney(service.priceFrom)}</td><td><StatusPill status={service.active ? "active" : "cancelled"}>{service.active ? "active" : "hidden"}</StatusPill></td><td><button className="ghost-button" type="button" onClick={() => setStore((current) => ({ ...current, services: current.services.map((item) => item.id === service.id ? { ...item, active: !item.active } : item) }))}>{service.active ? "Hide" : "Publish"}</button></td></tr>)}</tbody></table></section>;
  }

  function renderBookings() {
    return <section className="premium-card table-wrap"><table className="premium-table"><thead><tr><th>Service</th><th>Date</th><th>Client</th><th>Status</th><th>Update</th></tr></thead><tbody>{store.bookings.map((booking) => <tr key={booking.id}><td>{booking.serviceName}</td><td>{booking.date}</td><td>{booking.clientId}</td><td><StatusPill status={booking.status} /></td><td><select className="premium-select" value={booking.status} onChange={(e) => updateBooking(booking.id, { status: e.target.value })}>{Object.entries(BOOKING_STATUSES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></td></tr>)}</tbody></table></section>;
  }

  function renderDictionaries(type) {
    const key = type === "categories" ? "categories" : "cities";
    const items = store[key];
    return <section className="premium-card premium-card-inner"><div className="page-stack">{items.map((item) => <div className="list-row" key={item.id}><strong>{item.name}</strong><div style={{ display: "flex", gap: 8 }}><StatusPill status={item.active ? "active" : "cancelled"}>{item.active ? "active" : "inactive"}</StatusPill><button className="ghost-button" type="button" onClick={() => setStore((current) => ({ ...current, [key]: current[key].map((row) => row.id === item.id ? { ...row, active: !row.active } : row) }))}>Toggle</button></div></div>)}</div></section>;
  }

  function renderMessages() {
    return <section className="premium-card premium-card-inner"><div className="page-stack">{store.messages.map((message) => <div className="list-row" key={message.id}><div><strong>{message.from}</strong><p className="muted">{message.text}</p></div><button className="secondary-button" type="button" onClick={() => setStore((current) => ({ ...current, messages: current.messages.map((item) => item.id === message.id ? { ...item, unread: false } : item) }))}>Mark read</button></div>)}</div></section>;
  }

  function renderReviews() {
    return <section className="premium-card table-wrap"><table className="premium-table"><thead><tr><th>Author</th><th>Rating</th><th>Text</th><th>Visible</th><th></th></tr></thead><tbody>{store.reviews.map((review) => <tr key={review.id}><td>{review.author}</td><td>{review.rating}</td><td>{review.text}</td><td>{review.visible ? "yes" : "no"}</td><td><button className="ghost-button" type="button" onClick={() => setStore((current) => ({ ...current, reviews: current.reviews.map((item) => item.id === review.id ? { ...item, visible: !item.visible } : item) }))}>{review.visible ? "Hide" : "Show"}</button></td></tr>)}</tbody></table></section>;
  }

  function renderComplaints() {
    return <div className="page-stack">{store.complaints.map((complaint) => <article className="premium-card list-card" key={complaint.id}><div className="list-row"><h3>{complaint.title}</h3><StatusPill status={complaint.status}>{complaint.status}</StatusPill></div><p className="muted">{complaint.text}</p><button className="premium-button" type="button" onClick={() => setStore((current) => ({ ...current, complaints: current.complaints.map((item) => item.id === complaint.id ? { ...item, status: "resolved" } : item) }))}>Resolve</button></article>)}</div>;
  }

  function renderContent() {
    const content = store.content;
    return <section className="premium-card premium-card-inner"><form className="page-stack" onSubmit={(e) => { e.preventDefault(); showToast("Контент сохранен"); }}><input className="premium-input" value={content.heroTitle} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, heroTitle: sanitizeText(e.target.value, 120) } }))} /><textarea className="premium-textarea" value={content.heroSubtitle} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, heroSubtitle: sanitizeText(e.target.value, 240) } }))} /><textarea className="premium-textarea" value={content.faq} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, faq: sanitizeText(e.target.value, 500) } }))} /><button className="premium-button" type="submit">Сохранить контент</button></form></section>;
  }

  function renderSettings() {
    const content = store.content;
    return <section className="premium-card premium-card-inner"><div className="field-grid"><input className="premium-input" value={content.supportPhone} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, supportPhone: sanitizeText(e.target.value, 24) } }))} placeholder="Support phone" /><input className="premium-input" value={content.supportWhatsapp} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, supportWhatsapp: sanitizeText(e.target.value, 24) } }))} placeholder="Support WhatsApp" /><select className="premium-select" value={content.defaultCity} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, defaultCity: e.target.value } }))}>{KZ_CITIES.map((city) => <option key={city}>{city}</option>)}</select><label className="list-row" style={{ justifyContent: "flex-start" }}><input type="checkbox" checked={content.maintenanceMode} onChange={(e) => setStore((current) => ({ ...current, content: { ...current.content, maintenanceMode: e.target.checked } }))} /> Maintenance mode</label></div><p className="muted">Client features remain free. Monetization fields are optional for future vendor plans.</p></section>;
  }

  const titleMap = { dashboard: "Admin dashboard", users: "Пользователи", vendors: "Vendors", services: "Услуги", bookings: "Брони", categories: "Категории", cities: "Города", messages: "Сообщения", reviews: "Отзывы", complaints: "Жалобы", content: "Контент", analytics: "Аналитика", settings: "Настройки" };
  const renderMap = { dashboard: renderDashboard, users: renderUsers, vendors: renderVendors, services: renderServices, bookings: renderBookings, categories: () => renderDictionaries("categories"), cities: () => renderDictionaries("cities"), messages: renderMessages, reviews: renderReviews, complaints: renderComplaints, content: renderContent, analytics: renderDashboard, settings: renderSettings };

  return <div className="page-stack"><SectionHead title={titleMap[section]} text="Операционная панель управления платформой toi.kz." />{(renderMap[section] || renderDashboard)()}</div>;
}

export function InvitePage({ eventId }) {
  const { store, updateList } = useAppStore();
  const showToast = useToast();
  const event = store.events.find((item) => item.id === eventId) || store.events[0];
  const invitation = store.invitations[event?.id] || {};
  const guests = store.guests[event?.id] || [];
  const [name, setName] = useState("");

  function respond(status) {
    const safeName = sanitizeText(name, 80);
    if (!safeName) {
      showToast("Введите имя");
      return;
    }
    const existing = guests.find((guest) => guest.name.toLowerCase() === safeName.toLowerCase());
    const nextGuests = existing
      ? guests.map((guest) => guest.id === existing.id ? { ...guest, status } : guest)
      : [{ id: `guest_public_${Date.now()}`, name: safeName, phone: "", relation: "RSVP", status, plusOne: false, children: 0, tableId: "" }, ...guests];
    updateList("guests", event.id, nextGuests);
    showToast("Жауабыңыз сақталды");
  }

  return (
    <main className="app-loader" style={{ padding: 18 }}>
      <section className="premium-card premium-card-inner" style={{ width: "min(760px, 96vw)", textAlign: "center" }}>
        <img src="/images/toi-logo.png" alt="toi.kz" style={{ display: "block", margin: "0 auto 18px", width: 120, height: "auto" }} />
        <h1 style={{ fontFamily: "Playfair Display, Georgia, serif", fontSize: "clamp(34px, 7vw, 62px)", margin: 0 }}>{invitation.bride || "Bride"} & {invitation.groom || "Groom"}</h1>
        <p className="muted" style={{ fontSize: 18 }}>{invitation.message || "Сізді қуанышымызға ортақтасуға шақырамыз."}</p>
        <div className="grid-3" style={{ marginTop: 24, textAlign: "left" }}>
          <StatCard icon={Calendar} label="Дата" value={invitation.date || event?.date} />
          <StatCard icon={Building2} label="Venue" value={invitation.venue || "toi.kz"} />
          <StatCard icon={MapPin} label="Address" value={invitation.address || event?.city} />
        </div>
        {invitation.rsvpEnabled !== false ? (
          <div className="page-stack" style={{ marginTop: 24 }}>
            <input className="premium-input" value={name} onChange={(e) => setName(sanitizeText(e.target.value, 80))} placeholder="Атыңызды жазыңыз" aria-label="Имя гостя" />
            <div className="grid-3">
              <button className="premium-button" type="button" onClick={() => respond("coming")}>Келемін</button>
              <button className="secondary-button" type="button" onClick={() => respond("unknown")}>Мүмкін</button>
              <button className="danger-button" type="button" onClick={() => respond("declined")}>Келмеймін</button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
