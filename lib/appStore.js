"use client";

import {
  CATEGORIES,
  DEFAULT_BUDGET,
  DEFAULT_CHECKLIST,
  DEFAULT_EVENT,
  DEFAULT_GUESTS,
  DEFAULT_TABLES,
  DEFAULT_TIMELINE,
  KZ_CITIES,
  VENDOR_SEED,
} from "@/lib/appData";
import { getSession } from "@/lib/session";
import { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, get, set } from "firebase/database";

const STORE_KEY = "toi-platform-store-v1";

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function createDefaultStore() {
  const event = DEFAULT_EVENT;

  return {
    users: [
      {
        uid: "client_demo",
        role: "client",
        name: "Айдана",
        phone: "+77010000000",
        city: "Алматы",
        status: "active",
        createdAt: "2026-05-01T10:00:00.000Z",
      },
      {
        uid: "vendor_demo",
        role: "vendor",
        name: "Арман",
        phone: "+77002223344",
        city: "Астана",
        status: "active",
        createdAt: "2026-05-04T10:00:00.000Z",
      },
    ],
    events: [{ ...event, userId: "client_demo" }],
    vendors: VENDOR_SEED,
    services: VENDOR_SEED.map((vendor) => ({
      id: `service_${vendor.id}`,
      vendorId: vendor.id,
      category: vendor.category,
      title: vendor.title,
      description: vendor.description,
      priceFrom: vendor.priceFrom,
      city: vendor.city,
      images: [vendor.image],
      features: vendor.features,
      active: vendor.status === "approved",
      verified: vendor.verified,
      rating: vendor.rating,
      createdAt: "2026-05-01T10:00:00.000Z",
    })),
    bookings: [
      {
        id: "bk_demo_1",
        clientId: "client_demo",
        vendorId: "palazzo",
        serviceId: "service_palazzo",
        eventId: event.id,
        serviceName: "Palazzo Di Astana",
        vendorName: "Palazzo Di Astana",
        date: "2026-09-12",
        time: "18:00",
        guests: 180,
        status: "pending",
        price: 2700000,
        deposit: 300000,
        comment: "VIP room және halal menu керек",
        contactPhone: "+77010000000",
        createdAt: "2026-05-14T10:00:00.000Z",
        updatedAt: "2026-05-14T10:00:00.000Z",
      },
    ],
    guests: { [event.id]: DEFAULT_GUESTS },
    budget: { [event.id]: DEFAULT_BUDGET },
    checklist: { [event.id]: DEFAULT_CHECKLIST },
    tables: { [event.id]: DEFAULT_TABLES },
    timeline: { [event.id]: DEFAULT_TIMELINE },
    invitations: {
      [event.id]: {
        bride: "Айдана",
        groom: "Әли",
        date: event.date,
        venue: "Бақшасарай",
        address: "Алматы, Бостандық ауданы",
        dressCode: "Champagne / black tie",
        timing: "17:00 қонақтарды қарсы алу",
        message: "Сізді қуанышымызға ортақтасуға шақырамыз.",
        template: "dark premium",
        rsvpEnabled: true,
      },
    },
    notifications: {
      client_demo: [
        { id: "n1", type: "booking", title: "Заявка создана", text: "Palazzo Di Astana получил вашу заявку.", unread: true, createdAt: "2026-05-14T10:05:00.000Z" },
        { id: "n2", type: "checklist", title: "Срок задачи", text: "Пора подтвердить зал и тамаду.", unread: true, createdAt: "2026-05-15T10:05:00.000Z" },
      ],
      vendor_demo: [
        { id: "n3", type: "booking", title: "Новая заявка", text: "Клиент хочет забронировать дату.", unread: true, createdAt: "2026-05-14T10:05:00.000Z" },
      ],
      admin_demo: [
        { id: "n4", type: "vendor", title: "Новый vendor", text: "Проверьте заявку на подключение.", unread: true, createdAt: "2026-05-14T10:05:00.000Z" },
      ],
    },
    messages: [
      { id: "m1", section: "messages", from: "Айдана", role: "client", text: "Можно ли проверить свободную дату?", unread: true, createdAt: "2026-05-17T12:00:00.000Z" },
      { id: "m2", section: "requests", from: "Arman Show", role: "vendor", text: "Прошу проверить профиль услуги.", unread: true, createdAt: "2026-05-18T12:00:00.000Z" },
    ],
    reviews: [
      { id: "r1", vendorId: "palazzo", author: "Динара", rating: 5, text: "Сервис жоғары деңгейде болды.", visible: true, unread: true },
      { id: "r2", vendorId: "aisha-photo", author: "Мадина", rating: 5, text: "Фото өте сапалы шықты.", visible: true, unread: false },
    ],
    complaints: [
      { id: "cp1", title: "Ответ задерживается", user: "Айдана", status: "open", text: "Vendor не ответил 2 дня.", createdAt: "2026-05-18T10:00:00.000Z" },
    ],
    categories: CATEGORIES,
    cities: KZ_CITIES.map((name, index) => ({ id: `city_${index + 1}`, name, active: true, order: index + 1 })),
    content: {
      heroTitle: "Организуйте той без лишнего стресса",
      heroSubtitle: "Каталог, бронь, гости, бюджет және тайминг в одном premium PWA.",
      faq: "Для пользователей бесплатно. Vendor-профили проходят модерацию.",
      supportPhone: "+77000000000",
      supportWhatsapp: "77000000000",
      defaultCity: "Алматы",
      commissionPercent: 0,
      maintenanceMode: false,
    },
    busyDates: {},
    updatedAt: new Date().toISOString(),
  };
}

function loadStore() {
  if (typeof window === "undefined") return createDefaultStore();

  try {
    const stored = window.localStorage.getItem(STORE_KEY);
    if (!stored) return createDefaultStore();
    return { ...createDefaultStore(), ...JSON.parse(stored) };
  } catch {
    return createDefaultStore();
  }
}

function persistStore(store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function useAppStore() {
  const [store, setStoreState] = useState(createDefaultStore);
  const session = getSession();

  useEffect(() => {
    // 1. Initial load from local storage
    const localStore = loadStore();
    setStoreState(localStore);

    // 2. Fetch public halls/vendors from Firebase Realtime Database
    get(ref(db, "Halls"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const firebaseHalls = snapshot.val();
          const hallsArray = Array.isArray(firebaseHalls)
            ? firebaseHalls.filter(Boolean)
            : Object.entries(firebaseHalls).map(([key, val]) => ({ ...val, id: key }));

          setStoreState((current) => ({
            ...current,
            vendors: hallsArray,
            services: hallsArray.map((vendor) => ({
              id: `service_${vendor.id}`,
              vendorId: vendor.id,
              category: vendor.category,
              title: vendor.title,
              description: vendor.description,
              priceFrom: vendor.priceFrom,
              city: vendor.city,
              images: [vendor.image],
              features: vendor.features,
              active: vendor.status === "approved",
              verified: vendor.verified,
              rating: vendor.rating,
              createdAt: vendor.createdAt || "2026-05-01T10:00:00.000Z",
            })),
          }));
        }
      })
      .catch((err) => console.error("Error loading Halls from Firebase:", err));

    // 3. Fetch user-specific event and checklists if session exists
    if (session?.uid) {
      const userEvent = localStore.events.find((e) => e.userId === session.uid) || localStore.events[0];
      if (userEvent) {
        const eventId = userEvent.id;

        // Load Event
        get(ref(db, `events/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              events: current.events.map((e) => (e.id === eventId ? snap.val() : e)),
            }));
          }
        }).catch(() => {});

        // Load Guests
        get(ref(db, `guests/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              guests: { ...current.guests, [eventId]: snap.val() },
            }));
          }
        }).catch(() => {});

        // Load Budget
        get(ref(db, `budget/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              budget: { ...current.budget, [eventId]: snap.val() },
            }));
          }
        }).catch(() => {});

        // Load Checklist
        get(ref(db, `checklist/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              checklist: { ...current.checklist, [eventId]: snap.val() },
            }));
          }
        }).catch(() => {});

        // Load Tables
        get(ref(db, `tables/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              tables: { ...current.tables, [eventId]: snap.val() },
            }));
          }
        }).catch(() => {});

        // Load Timeline
        get(ref(db, `timeline/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              timeline: { ...current.timeline, [eventId]: snap.val() },
            }));
          }
        }).catch(() => {});

        // Load Invitations
        get(ref(db, `invitations/${eventId}`)).then((snap) => {
          if (snap.exists()) {
            setStoreState((current) => ({
              ...current,
              invitations: { ...current.invitations, [eventId]: snap.val() },
            }));
          }
        }).catch(() => {});
      }

      // Load client's bookings from database
      localStore.bookings.forEach((booking) => {
        if (booking.clientId === session.uid) {
          get(ref(db, `bookings/${booking.id}`)).then((snap) => {
            if (snap.exists()) {
              setStoreState((current) => ({
                ...current,
                bookings: current.bookings.map((b) => (b.id === booking.id ? snap.val() : b)),
              }));
            }
          }).catch(() => {});
        }
      });
    }
  }, [session?.uid]);

  const setStore = (updater) => {
    setStoreState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      const stamped = { ...next, updatedAt: new Date().toISOString() };
      persistStore(stamped);

      // Perform selective background sync to Firebase Realtime Database
      if (session?.uid) {
        const event = stamped.events.find((e) => e.userId === session.uid) || stamped.events[0];
        if (event) {
          const eventId = event.id;
          
          if (JSON.stringify(stamped.events) !== JSON.stringify(current.events)) {
            set(ref(db, `events/${eventId}`), event).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.guests[eventId]) !== JSON.stringify(current.guests[eventId])) {
            set(ref(db, `guests/${eventId}`), stamped.guests[eventId] || []).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.budget[eventId]) !== JSON.stringify(current.budget[eventId])) {
            set(ref(db, `budget/${eventId}`), stamped.budget[eventId] || []).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.checklist[eventId]) !== JSON.stringify(current.checklist[eventId])) {
            set(ref(db, `checklist/${eventId}`), stamped.checklist[eventId] || []).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.tables[eventId]) !== JSON.stringify(current.tables[eventId])) {
            set(ref(db, `tables/${eventId}`), stamped.tables[eventId] || []).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.timeline[eventId]) !== JSON.stringify(current.timeline[eventId])) {
            set(ref(db, `timeline/${eventId}`), stamped.timeline[eventId] || []).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.invitations[eventId]) !== JSON.stringify(current.invitations[eventId])) {
            set(ref(db, `invitations/${eventId}`), stamped.invitations[eventId] || {}).catch(e => console.warn(e));
          }
          if (JSON.stringify(stamped.bookings) !== JSON.stringify(current.bookings)) {
            stamped.bookings.forEach((booking) => {
              if (booking.clientId === session.uid) {
                set(ref(db, `bookings/${booking.id}`), {
                  clientId: booking.clientId,
                  vendorId: booking.vendorId,
                  date: booking.date,
                  status: booking.status,
                  time: booking.time,
                  guests: booking.guests,
                  eventType: booking.eventType,
                  price: booking.price,
                  deposit: booking.deposit,
                  comment: booking.comment || "",
                  contactPhone: booking.contactPhone,
                  serviceName: booking.serviceName,
                  vendorName: booking.vendorName,
                }).catch(e => console.warn(e));
              }
            });
          }
        }
      }

      return stamped;
    });
  };

  const currentEvent = useMemo(() => {
    const owned = store.events.find((event) => event.userId === session?.uid);
    return owned || store.events[0] || null;
  }, [store.events, session?.uid]);

  const upsertCurrentUser = (user) => {
    setStore((current) => {
      const exists = current.users.some((item) => item.uid === user.uid);
      const users = exists
        ? current.users.map((item) => (item.uid === user.uid ? { ...item, ...user } : item))
        : [{ ...user, createdAt: user.createdAt || new Date().toISOString() }, ...current.users];
      return { ...current, users };
    });
  };

  const addEvent = (eventPatch = {}) => {
    const user = getSession();
    const event = {
      ...DEFAULT_EVENT,
      ...eventPatch,
      id: uid("event"),
      userId: user?.uid || "client_demo",
      progress: 12,
    };
    setStore((current) => ({
      ...current,
      events: [event, ...current.events],
      guests: { ...current.guests, [event.id]: [] },
      budget: { ...current.budget, [event.id]: DEFAULT_BUDGET },
      checklist: { ...current.checklist, [event.id]: DEFAULT_CHECKLIST },
      tables: { ...current.tables, [event.id]: [] },
      timeline: { ...current.timeline, [event.id]: DEFAULT_TIMELINE },
      invitations: { ...current.invitations, [event.id]: { ...current.invitations[DEFAULT_EVENT.id], date: event.date } },
    }));
    return event;
  };

  const addBooking = (booking) => {
    const id = uid("booking");
    const now = new Date().toISOString();
    const nextBooking = { ...booking, id, status: booking.status || "pending", createdAt: now, updatedAt: now };

    setStore((current) => ({
      ...current,
      bookings: [nextBooking, ...current.bookings],
      notifications: {
        ...current.notifications,
        [booking.clientId]: [
          {
            id: uid("notification"),
            type: "booking",
            title: "Заявка отправлена",
            text: `${booking.vendorName} получил вашу заявку.`,
            unread: true,
            createdAt: now,
          },
          ...(current.notifications[booking.clientId] || []),
        ],
      },
    }));

    return nextBooking;
  };

  const updateBooking = (bookingId, patch) => {
    setStore((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...patch, updatedAt: new Date().toISOString() } : booking
      ),
    }));
  };

  const updateList = (node, eventId, list) => {
    setStore((current) => ({
      ...current,
      [node]: { ...current[node], [eventId]: list },
    }));
  };

  const markNotificationsRead = (uidValue) => {
    setStore((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [uidValue]: (current.notifications[uidValue] || []).map((item) => ({ ...item, unread: false })),
      },
    }));
  };

  return {
    store,
    currentEvent,
    setStore,
    upsertCurrentUser,
    addEvent,
    addBooking,
    updateBooking,
    updateList,
    markNotificationsRead,
    uid,
  };
}
