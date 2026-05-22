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
import { auth, db } from "@/lib/firebase";
import {
  patchUserProfile,
  readActiveServices,
  readApprovedVendors,
  readClientBookings,
  readOnce,
  readUserEvents,
  readUserProfile,
  saveVendorProfile,
  snapshotToArray,
} from "@/lib/firebaseData";
import { getSession } from "@/lib/session";
import { equalTo, get, orderByChild, query, ref, set } from "firebase/database";
import { useEffect, useMemo, useState } from "react";

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function createDefaultStore() {
  return {
    users: [],
    events: [],
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
    bookings: [],
    guests: {},
    budget: {},
    checklist: {},
    tables: {},
    timeline: {},
    invitations: {},
    invitationResponses: {},
    favorites: {},
    locations: VENDOR_SEED.map((vendor) => ({
      id: `loc_${vendor.id}`,
      vendorId: vendor.id,
      title: vendor.businessName,
      category: vendor.category,
      city: vendor.city,
      address: vendor.address || "",
      location: vendor.location || null,
    })),
    notifications: {},
    messages: [],
    reviews: [],
    complaints: [],
    categories: CATEGORIES,
    cities: KZ_CITIES.map((name, index) => ({ id: `city_${index + 1}`, name, active: true, order: index + 1 })),
    content: {
      heroTitle: "Организуйте той без лишнего стресса",
      heroSubtitle: "Каталог, бронь, гости, бюджет және тайминг в одном premium PWA.",
      faq: "Для пользователей бесплатно. Vendor-профили проходят модерацию.",
      supportPhone: "+77000000000",
      supportWhatsapp: "77000000000",
      defaultCity: "Астана",
      commissionPercent: 0,
      maintenanceMode: false,
    },
    busyDates: {},
    updatedAt: nowIso(),
  };
}

function byId(rows) {
  return new Map((rows || []).map((item) => [item.id || item.uid, item]));
}

function mergeRows(seedRows, firebaseRows) {
  const merged = byId(seedRows);
  (firebaseRows || []).forEach((row) => {
    const key = row.id || row.uid;
    if (key) merged.set(key, { ...merged.get(key), ...row });
  });
  return [...merged.values()];
}

function hasChanged(a, b) {
  return JSON.stringify(a ?? null) !== JSON.stringify(b ?? null);
}

function safeSet(path, value) {
  if (!db) return Promise.resolve();
  return set(ref(db, path), value).catch(() => {});
}

async function readArray(path) {
  if (!db) return [];
  const snapshot = await get(ref(db, path)).catch(() => null);
  return snapshotToArray(snapshot);
}

async function readQueryArray(path, child, value) {
  if (!db) return [];
  const snapshot = await get(query(ref(db, path), orderByChild(child), equalTo(value))).catch(() => null);
  return snapshotToArray(snapshot);
}

async function loadEventCollections(eventId) {
  if (!eventId) return {};
  const [guests, budget, checklist, tables, timeline, invitation, invitationResponses] = await Promise.all([
    readOnce(`guests/${eventId}`).catch(() => null),
    readOnce(`budget/${eventId}`).catch(() => null),
    readOnce(`checklist/${eventId}`).catch(() => null),
    readOnce(`tables/${eventId}`).catch(() => null),
    readOnce(`timeline/${eventId}`).catch(() => null),
    readOnce(`invitations/${eventId}`).catch(() => null),
    readOnce(`invitationResponses/${eventId}`).catch(() => null),
  ]);

  return {
    guests: { [eventId]: guests || [] },
    budget: { [eventId]: budget || [] },
    checklist: { [eventId]: checklist || [] },
    tables: { [eventId]: tables || [] },
    timeline: { [eventId]: timeline || [] },
    invitations: { [eventId]: invitation || {} },
    invitationResponses: { [eventId]: invitationResponses ? Object.values(invitationResponses) : [] },
  };
}

async function loadFirebaseStore(user) {
  const base = createDefaultStore();
  const role = user?.role || "client";
  const uidValue = user?.uid || auth?.currentUser?.uid || "";

  const [vendors, services, content] = await Promise.all([
    readApprovedVendors().catch(() => []),
    readActiveServices().catch(() => []),
    readOnce("adminContent").catch(() => null),
  ]);

  let next = {
    ...base,
    vendors: mergeRows(base.vendors, vendors),
    services: mergeRows(base.services, services),
    content: content ? { ...base.content, ...content } : base.content,
  };

  if (!uidValue) return next;

  const [profile, events, clientBookings, notifications, favorites] = await Promise.all([
    readUserProfile(uidValue).catch(() => user),
    readUserEvents(uidValue).catch(() => []),
    role === "client" ? readClientBookings(uidValue).catch(() => []) : Promise.resolve([]),
    readOnce(`notifications/${uidValue}`).catch(() => null),
    readOnce(`favorites/${uidValue}`).catch(() => null),
  ]);

  next = {
    ...next,
    users: profile ? [profile] : [],
    events,
    bookings: clientBookings,
    notifications: notifications ? { [uidValue]: Object.values(notifications) } : {},
    favorites: favorites ? { [uidValue]: favorites } : {},
  };

  if (role === "vendor" || role === "admin") {
    const vendorRows = role === "admin"
      ? await readArray("vendors").catch(() => [])
      : await readQueryArray("vendors", "ownerId", uidValue).catch(() => []);
    const vendorIds = new Set(vendorRows.map((vendor) => vendor.id));

    const [allServices, allBookings, messages, busyDates] = await Promise.all([
      role === "admin"
        ? readArray("services").catch(() => [])
        : Promise.all([...vendorIds].map((vendorId) => readQueryArray("services", "vendorId", vendorId).catch(() => []))).then((rows) => rows.flat()),
      role === "admin"
        ? readArray("bookings").catch(() => [])
        : Promise.all([...vendorIds].map((vendorId) => readQueryArray("bookings", "vendorId", vendorId).catch(() => []))).then((rows) => rows.flat()),
      readArray("messages").catch(() => []),
      role === "admin"
        ? readOnce("busyDates").catch(() => null)
        : Promise.all([...vendorIds].map(async (vendorId) => [vendorId, (await readOnce(`busyDates/${vendorId}`).catch(() => [])) || []])).then(Object.fromEntries),
    ]);

    next = {
      ...next,
      vendors: role === "admin" ? mergeRows(next.vendors, vendorRows) : vendorRows.length ? vendorRows : next.vendors,
      services: role === "admin" ? mergeRows(next.services, allServices) : allServices.filter((service) => vendorIds.has(service.vendorId)),
      bookings: role === "admin" ? allBookings : allBookings.filter((booking) => vendorIds.has(booking.vendorId)),
      messages,
      busyDates: busyDates || {},
    };
  }

  if (role === "admin") {
    const [users, reviews, complaints] = await Promise.all([
      readArray("users").catch(() => []),
      readArray("reviews").catch(() => []),
      readArray("complaints").catch(() => []),
    ]);
    next = { ...next, users, reviews, complaints };
  }

  const event = next.events[0];
  if (event?.id) {
    next = { ...next, ...(await loadEventCollections(event.id)) };
  }

  return next;
}

function syncChanges(current, next, user) {
  const uidValue = user?.uid || auth?.currentUser?.uid;
  const role = user?.role || "client";
  if (!uidValue) return;

  const currentUsers = byId(current.users);
  next.users.forEach((profile) => {
    const key = profile.uid || profile.id;
    if (key && hasChanged(profile, currentUsers.get(key))) {
      patchUserProfile(key, profile).catch(() => {});
    }
  });

  const currentVendors = byId(current.vendors);
  next.vendors.forEach((vendor) => {
    if (vendor.id && hasChanged(vendor, currentVendors.get(vendor.id))) {
      saveVendorProfile(vendor.id, vendor).catch(() => {});
    }
  });

  const currentServices = byId(current.services);
  next.services.forEach((service) => {
    if (service.id && hasChanged(service, currentServices.get(service.id))) {
      safeSet(`services/${service.id}`, { ...service, updatedAt: nowIso() });
    }
  });

  const currentBookings = byId(current.bookings);
  next.bookings.forEach((booking) => {
    if (booking.id && hasChanged(booking, currentBookings.get(booking.id))) {
      safeSet(`bookings/${booking.id}`, { ...booking, updatedAt: nowIso() });
    }
  });

  const currentEvents = byId(current.events);
  next.events.forEach((event) => {
    if (event.id && hasChanged(event, currentEvents.get(event.id))) {
      safeSet(`events/${event.id}`, { ...event, updatedAt: nowIso() });
    }
  });

  Object.entries(next.guests).forEach(([eventId, list]) => {
    if (hasChanged(list, current.guests[eventId])) safeSet(`guests/${eventId}`, list || []);
  });
  Object.entries(next.budget).forEach(([eventId, list]) => {
    if (hasChanged(list, current.budget[eventId])) safeSet(`budget/${eventId}`, list || []);
  });
  Object.entries(next.checklist).forEach(([eventId, list]) => {
    if (hasChanged(list, current.checklist[eventId])) safeSet(`checklist/${eventId}`, list || []);
  });
  Object.entries(next.tables).forEach(([eventId, list]) => {
    if (hasChanged(list, current.tables[eventId])) safeSet(`tables/${eventId}`, list || []);
  });
  Object.entries(next.timeline).forEach(([eventId, list]) => {
    if (hasChanged(list, current.timeline[eventId])) safeSet(`timeline/${eventId}`, list || []);
  });
  Object.entries(next.invitations).forEach(([eventId, value]) => {
    if (hasChanged(value, current.invitations[eventId])) safeSet(`invitations/${eventId}`, value || {});
  });
  Object.entries(next.notifications).forEach(([ownerUid, list]) => {
    if (hasChanged(list, current.notifications[ownerUid])) safeSet(`notifications/${ownerUid}`, list || []);
  });
  Object.entries(next.favorites).forEach(([ownerUid, value]) => {
    if (hasChanged(value, current.favorites[ownerUid])) safeSet(`favorites/${ownerUid}`, value || {});
  });
  Object.entries(next.busyDates).forEach(([vendorId, list]) => {
    if (hasChanged(list, current.busyDates[vendorId])) safeSet(`busyDates/${vendorId}`, list || []);
  });

  if (role === "admin") {
    if (hasChanged(next.content, current.content)) safeSet("adminContent", next.content);
    if (hasChanged(next.categories, current.categories)) safeSet("categories", next.categories);
    if (hasChanged(next.cities, current.cities)) safeSet("cities", next.cities);
    const currentMessages = byId(current.messages);
    next.messages.forEach((message) => {
      if (message.id && hasChanged(message, currentMessages.get(message.id))) safeSet(`messages/${message.id}`, message);
    });
    const currentComplaints = byId(current.complaints);
    next.complaints.forEach((complaint) => {
      if (complaint.id && hasChanged(complaint, currentComplaints.get(complaint.id))) safeSet(`complaints/${complaint.id}`, complaint);
    });
    const currentReviews = byId(current.reviews);
    next.reviews.forEach((review) => {
      if (review.id && hasChanged(review, currentReviews.get(review.id))) safeSet(`reviews/${review.id}`, review);
    });
  }
}

export function useAppStore() {
  const [store, setStoreState] = useState(createDefaultStore);
  const session = getSession();
  const userKey = `${session?.uid || auth?.currentUser?.uid || ""}:${session?.role || ""}`;

  useEffect(() => {
    let disposed = false;
    loadFirebaseStore(session).then((loaded) => {
      if (!disposed) setStoreState(loaded);
    });

    return () => {
      disposed = true;
    };
  }, [userKey]);

  const setStore = (updater) => {
    setStoreState((current) => {
      const next = typeof updater === "function" ? updater(current) : updater;
      const stamped = { ...next, updatedAt: nowIso() };
      syncChanges(current, stamped, session);
      return stamped;
    });
  };

  const currentEvent = useMemo(() => {
    const uidValue = session?.uid || auth?.currentUser?.uid;
    const owned = store.events.find((event) => event.userId === uidValue);
    return owned || store.events[0] || null;
  }, [store.events, session?.uid]);

  const upsertCurrentUser = (user) => {
    setStore((current) => {
      const exists = current.users.some((item) => item.uid === user.uid);
      const users = exists
        ? current.users.map((item) => (item.uid === user.uid ? { ...item, ...user } : item))
        : [{ ...user, createdAt: user.createdAt || nowIso() }, ...current.users];
      return { ...current, users };
    });
  };

  const addEvent = (eventPatch = {}) => {
    const user = getSession();
    const event = {
      ...DEFAULT_EVENT,
      ...eventPatch,
      id: uid("event"),
      userId: user?.uid || auth?.currentUser?.uid,
      progress: 12,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    setStore((current) => ({
      ...current,
      events: [event, ...current.events],
      guests: { ...current.guests, [event.id]: [] },
      budget: { ...current.budget, [event.id]: DEFAULT_BUDGET },
      checklist: { ...current.checklist, [event.id]: DEFAULT_CHECKLIST },
      tables: { ...current.tables, [event.id]: [] },
      timeline: { ...current.timeline, [event.id]: DEFAULT_TIMELINE },
      invitations: { ...current.invitations, [event.id]: { date: event.date, rsvpEnabled: true } },
    }));
    safeSet(`events/${event.id}`, event);
    return event;
  };

  const addBooking = async (booking) => {
    const id = uid("booking");
    const nextBooking = { ...booking, id, status: booking.status || "pending", createdAt: nowIso(), updatedAt: nowIso() };
    const notification = {
      id: uid("notification"),
      type: "booking",
      title: "Заявка отправлена",
      text: `${booking.vendorName} получил вашу заявку.`,
      unread: true,
      createdAt: nowIso(),
    };
    let nextNotifications = [];

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
            createdAt: nowIso(),
          },
          ...(current.notifications[booking.clientId] || []),
        ],
      },
    }));

    try {
      if (!db) throw new Error("Firebase database is not configured");
      await set(ref(db, `bookings/${id}`), nextBooking);
    } catch (error) {
      setStoreState((current) => ({
        ...current,
        bookings: current.bookings.filter((item) => item.id !== id),
      }));
      throw error;
    }
    return nextBooking;
  };

  const updateBooking = (bookingId, patch) => {
    setStore((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, ...patch, updatedAt: nowIso() } : booking
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
