export const KZ_CITIES = ["Астана"];

export const EVENT_TYPES = [
  "Үйлену той",
  "Қыз ұзату",
  "Құдалық",
  "Сырға салу",
  "Беташар",
  "Мерейтой",
  "Тұсаукесер",
  "Сүндет той",
];

export const CATEGORIES = [
  { id: "halls", name: "Тойханалар", icon: "building", active: true, order: 1 },
  { id: "organizers", name: "Организаторлар", icon: "clipboard", active: true, order: 2 },
  { id: "asaba", name: "Асаба / той жүргізуші", icon: "mic", active: true, order: 3 },
  { id: "photo", name: "Фотографтар", icon: "camera", active: true, order: 4 },
  { id: "video", name: "Видеографтар", icon: "video", active: true, order: 5 },
  { id: "mobile", name: "Мобилографтар", icon: "phone", active: true, order: 6 },
  { id: "decor", name: "Декор", icon: "sparkles", active: true, order: 7 },
  { id: "music", name: "Музыка / DJ", icon: "music", active: true, order: 8 },
  { id: "cakes", name: "Торт", icon: "cake", active: true, order: 9 },
  { id: "cortege", name: "Кортеж", icon: "car", active: true, order: 10 },
  { id: "beauty", name: "Макияж", icon: "user", active: true, order: 11 },
  { id: "dress", name: "Көйлек / костюм", icon: "heart", active: true, order: 12 },
  { id: "invites", name: "Шақырту дизайнерлері", icon: "send", active: true, order: 13 },
  { id: "uzatu", name: "Қыз ұзату қызметтері", icon: "heart", active: true, order: 14 },
];

export const ABOUT_CONTENT = {
  title: "TOI.KZ - Қазақстандағы той жоспарлауға арналған premium PWA",
  intro:
    "TOI.KZ тойханалар, қызмет көрсетушілер, бронь, қонақтар, бюджет, чеклист және digital шақыруды бір қауіпсіз мобильді workspace-ке біріктіреді.",
  fromOldSite:
    "Платформа Астанадағы үйлену той, қыз ұзату, беташар және отбасылық мерекелерге керек сервистерді тез табуға көмектеседі.",
  points: [
    "Клиенттерге: той күнін, бюджет, қонақтар, RSVP және броньдарды бір жерде бақылау.",
    "Vendor-ларға: қызметтерді жариялау, өтінімдерді көру, бос күндерді басқару және пікірлермен жұмыс істеу.",
    "Admin-ға: vendor moderation, service approval, booking бақылауы және қауіпсіз операциялық панель.",
  ],
};

const IMAGES = {
  hall: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
  planner: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
  host: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200",
  photo: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
  video: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
  mobile: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
  decor: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
  music: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
  cake: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=1200",
  car: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
  beauty: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=1200",
  dress: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200",
  invite: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200",
  uzatu: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
};

const CATEGORY_DETAILS = {
  halls: {
    names: ["Royal Blue Hall", "Aq Saray Astana", "Grand Sapphire", "Shanyraq Palace", "Emerald Ballroom"],
    basePrice: 14500,
    image: IMAGES.hall,
    description: "Астанадағы premium тойхана: үлкен сахна, LED экран, welcome zone, parking және банкет менеджері.",
    tags: ["LED", "halal menu", "parking", "VIP room", "stage"],
    capacity: 420,
  },
  organizers: { names: ["Toi Pro Agency", "Aru Events", "Jas Otau Planning", "Blue Ribbon KZ", "Qonaq Creative"], basePrice: 350000, image: IMAGES.planner, description: "Тойды толық жүргізетін команда: смета, vendor coordination, timing және event day control.", tags: ["full planning", "coordinator", "budget", "vendor brief", "script"] },
  asaba: { names: ["Asaba Erbol", "Nursultan Host", "Aigerim Show", "Dastur Host", "Mereke Voice"], basePrice: 320000, image: IMAGES.host, description: "Қазақша/орысша той жүргізуші: сценарий, беташар, бата, интерактив және family protocol.", tags: ["KZ/RU", "betashar", "bata", "games", "script"] },
  photo: { names: ["Aisha Photo", "Mereke Frames", "Otau Editorial", "Sapar Wedding", "Blue Lens Studio"], basePrice: 260000, image: IMAGES.photo, description: "Editorial wedding photo, love story және той күні толық репортаж. Preview 7 күн ішінде.", tags: ["love story", "album", "retouch", "cloud gallery", "preview"] },
  video: { names: ["Qadam Films", "Toi Cinema", "Astana Wedding Film", "Zheruyik Video", "Aq Tilek Production"], basePrice: 330000, image: IMAGES.video, description: "Wedding film, teaser, drone және multi-camera түсірілім. Color grading кіреді.", tags: ["drone", "teaser", "full film", "multi camera", "color"] },
  mobile: { names: ["Reels Toi", "Moment Mobile", "TikTok Wedding KZ", "Qyzyq Reels", "Blue Story Maker"], basePrice: 90000, image: IMAGES.mobile, description: "Той күні reels, stories және short video жасайтын мобилограф қызметі.", tags: ["reels", "same day edit", "stories", "vertical video", "behind scenes"] },
  decor: { names: ["Blue Bloom Decor", "Alem Design", "Otau Stage", "Crystal Wedding Decor", "Qazaq Ornament"], basePrice: 280000, image: IMAGES.decor, description: "Сахна, welcome zone, фотозона және үстел декоры. Premium dark blue/cyan бағыттары бар.", tags: ["stage", "photo zone", "welcome", "table decor", "3D mockup"] },
  music: { names: ["Blue DJ", "Saz Live Band", "Astana Sound", "Qara Jorga Music", "Mereke DJ"], basePrice: 180000, image: IMAGES.music, description: "DJ, live band және sound engineer. Қазақша, орысша, international playlist дайындалады.", tags: ["DJ", "live band", "playlist", "sound check", "MC support"] },
  cakes: { names: ["Sweet Toi", "Aq Tattim", "Blue Cake Lab", "Mereke Dessert", "Astana Patisserie"], basePrice: 95000, image: IMAGES.cake, description: "Wedding cake, dessert bar және ұлттық тәттілер. Доставка және дегустация мүмкіндігі бар.", tags: ["cake", "dessert bar", "tasting", "delivery", "custom design"] },
  cortege: { names: ["Astana Cortege", "Elite Cars KZ", "Wedding Drive", "Blue Route", "Lux Auto Toi"], basePrice: 120000, image: IMAGES.car, description: "Той кортежі: premium sedan, SUV және retro көліктер. Driver және decoration опциялары бар.", tags: ["driver", "decor", "premium cars", "route plan", "photo stop"] },
  beauty: { names: ["Aru Beauty", "Makeup Astana", "Bride Glow", "Sulu Studio", "Elite Hair KZ"], basePrice: 65000, image: IMAGES.beauty, description: "Келін макияжы, шаш үлгісі, trial look және той күні early morning service.", tags: ["makeup", "hair", "trial", "on-site", "touch-up"] },
  dress: { names: ["Otau Dress", "Aru Bridal", "Sultan Suits", "White Atelier", "Saukele Studio"], basePrice: 180000, image: IMAGES.dress, description: "Келін көйлек, күйеу костюм, сәукеле және аксессуарлар. Rental және custom tailoring бар.", tags: ["rental", "custom", "fitting", "accessories", "delivery"] },
  invites: { names: ["Invite Studio", "Digital Otau", "Blue RSVP", "Aru Design", "Qazaq Invite"], basePrice: 45000, image: IMAGES.invite, description: "Digital invitation, printed invitation, RSVP form және WhatsApp share-ready дизайн.", tags: ["digital", "print", "RSVP", "QR", "WhatsApp"] },
  uzatu: { names: ["Uzatu Ceremony", "Aru Uzatu", "Qyz Zholy", "Saukele Event", "Ak Bosaga"], basePrice: 240000, image: IMAGES.uzatu, description: "Қыз ұзату сценарийі, декор, асаба, дәстүр және family coordination толық пакет.", tags: ["scenario", "dastur", "decor", "asaba", "family flow"] },
};

const DISTRICTS = ["Есіл", "Нұра", "Сарыарқа", "Байқоңыр", "Мәңгілік Ел"];
const DATE_SETS = [
  ["2026-06-12", "2026-07-20", "2026-09-14"],
  ["2026-06-18", "2026-08-11", "2026-10-05"],
  ["2026-07-06", "2026-08-28", "2026-11-01"],
  ["2026-09-05", "2026-10-10", "2026-12-12"],
  ["2026-06-27", "2026-09-21", "2026-11-22"],
];

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9а-яәіңғүұқөһ\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-");

export const VENDOR_SEED = CATEGORIES.flatMap((category, categoryIndex) => {
  const details = CATEGORY_DETAILS[category.id];
  return details.names.map((name, itemIndex) => {
    const district = DISTRICTS[(categoryIndex + itemIndex) % DISTRICTS.length];
    const price = details.basePrice + itemIndex * Math.max(5000, Math.round(details.basePrice * 0.08));
    const rating = Number((4.55 + ((categoryIndex + itemIndex) % 5) * 0.08).toFixed(1));
    const id = `${category.id}-${toSlug(name)}`;
    const coordinates = {
      lat: Number((51.124 + categoryIndex * 0.004 + itemIndex * 0.0018).toFixed(6)),
      lng: Number((71.392 + categoryIndex * 0.003 - itemIndex * 0.0015).toFixed(6)),
    };

    return {
      id,
      ownerId: `vendor_seed_${id}`,
      name,
      businessName: name,
      title: name,
      category: category.name,
      categoryId: category.id,
      city: "Астана",
      district,
      address: `Астана, ${district}, Мәңгілік Ел ${12 + itemIndex}`,
      description: details.description,
      priceFrom: price,
      capacity: details.capacity ? details.capacity + itemIndex * 30 : null,
      rating,
      reviewsCount: 38 + categoryIndex * 7 + itemIndex * 11,
      verified: itemIndex !== 4,
      featured: itemIndex === 0 || (categoryIndex + itemIndex) % 5 === 0,
      premium: itemIndex === 0 || itemIndex === 1,
      status: "approved",
      phone: `+7701${String(categoryIndex + 10).padStart(2, "0")}${String(itemIndex + 10000).slice(0, 5)}`,
      whatsapp: `7701${String(categoryIndex + 10).padStart(2, "0")}${String(itemIndex + 10000).slice(0, 5)}`,
      instagram: `${toSlug(name).replace(/-/g, ".")}.kz`,
      image: details.image,
      tags: details.tags,
      features: details.tags,
      availableDates: DATE_SETS[itemIndex],
      availability: DATE_SETS[itemIndex],
      coordinates,
      location: coordinates,
      url2gis: "",
      reviews: [
        { user: "Айгерім", rating: 5, date: "2026-02-12", text: "Сервис ұнады, команда уақытында келді және бәрін нақты түсіндірді." },
        { user: "Мадина", rating: 4, date: "2026-03-04", text: "Бағасы мен сапасы жақсы. Той форматына ыңғайлы ұсыныс берді." },
      ],
      createdAt: `2026-05-${String((itemIndex % 9) + 1).padStart(2, "0")}T10:00:00.000Z`,
    };
  });
});

export const DEFAULT_EVENT = {
  id: "event-main",
  type: "Үйлену той",
  title: "Айдана мен Әлидің тойы",
  date: "2026-09-12",
  city: "Астана",
  guestCount: 180,
  budget: 6500000,
  progress: 42,
};

export const DEFAULT_GUESTS = [
  { id: "g1", name: "Гүлнар апай", phone: "+77010000001", relation: "туыс", status: "coming", plusOne: true, children: 0, tableId: "t1", side: "bride", invitationStatus: "sent" },
  { id: "g2", name: "Ерлан", phone: "+77010000002", relation: "дос", status: "unknown", plusOne: false, children: 0, tableId: "", side: "groom", invitationStatus: "draft" },
  { id: "g3", name: "Айгерім", phone: "+77010000003", relation: "қыз жақ", status: "invited", plusOne: true, children: 1, tableId: "t2", side: "family", invitationStatus: "sent" },
];

export const DEFAULT_BUDGET = [
  { id: "b1", category: "зал", title: "Банкет залы", planned: 3200000, actual: 0, paid: false },
  { id: "b2", category: "фото/видео", title: "Фото және видео", planned: 650000, actual: 250000, paid: true },
  { id: "b3", category: "декор", title: "Сахна декоры", planned: 420000, actual: 0, paid: false },
  { id: "b4", category: "қыз ұзату", title: "Қыз ұзату пакеті", planned: 700000, actual: 0, paid: false },
];

export const DEFAULT_CHECKLIST = [
  { id: "c1", group: "6 ай қалғанда", title: "Күнді бекіту және бюджет шегін анықтау", done: true, dueDate: "2026-03-01", reminder: false },
  { id: "c2", group: "5 ай қалғанда", title: "Қыз ұзату мен негізгі той форматын бөлек жоспарлау", done: false, dueDate: "2026-04-01", reminder: true },
  { id: "c3", group: "3 ай қалғанда", title: "Тойхана, асаба, фото/видео және декорды брондау", done: false, dueDate: "2026-06-01", reminder: true },
  { id: "c4", group: "1 ай қалғанда", title: "Қонақтар тізімін және RSVP жауаптарын нақтылау", done: false, dueDate: "2026-08-12", reminder: true },
  { id: "c5", group: "1 апта қалғанда", title: "Таймингті барлық жауаптылармен бекіту", done: false, dueDate: "2026-09-05", reminder: true },
];

export const DEFAULT_TABLES = [
  { id: "t1", name: "Төр жақ", capacity: 10, note: "" },
  { id: "t2", name: "Достар", capacity: 12, note: "Құда жақпен араластырмау" },
  { id: "t3", name: "Жұмыс", capacity: 10, note: "" },
];

export const DEFAULT_TIMELINE = [
  { id: "tl1", time: "17:00", title: "Қонақтарды қарсы алу", responsible: "Координатор", note: "Welcome zone дайын болсын" },
  { id: "tl2", time: "18:00", title: "Жас жұбайлар кіреді", responsible: "Той жүргізуші", note: "" },
  { id: "tl3", time: "18:20", title: "Беташар", responsible: "Асаба", note: "Домбыра және микрофон тексерілсін" },
  { id: "tl4", time: "19:00", title: "Бірінші би", responsible: "DJ", note: "" },
  { id: "tl5", time: "22:00", title: "Торт", responsible: "Координатор", note: "Шамдар дайын" },
];

export const INVITATION_TEMPLATES = [
  "classic",
  "blue luxury TOI.KZ",
  "gold wedding",
  "minimal",
  "Kazakh traditional",
];

export const BOOKING_STATUSES = {
  pending: "Ожидает подтверждения",
  confirmed: "Подтверждено",
  depositPaid: "Оплачен депозит",
  cancelled: "Отменено",
  completed: "Завершено",
  declined: "Отклонено",
};
