export const KZ_CITIES = [
  "Астана",
  "Алматы",
  "Шымкент",
  "Ақтөбе",
  "Қарағанды",
  "Тараз",
  "Павлодар",
  "Өскемен",
  "Семей",
  "Атырау",
  "Қостанай",
  "Қызылорда",
  "Орал",
  "Петропавл",
  "Ақтау",
  "Түркістан",
];

export const EVENT_TYPES = [
  "Үйлену той",
  "Қыз ұзату",
  "Құдалық",
  "Сырға салу",
  "Беташар",
  "Мерейтой",
  "Тұсаукесер",
  "Сүндет той",
  "Корпоратив",
  "Туған күн",
];

export const CATEGORIES = [
  { id: "halls", name: "Тойханалар", icon: "building", active: true, order: 1 },
  { id: "restaurants", name: "Ресторандар", icon: "utensils", active: true, order: 2 },
  { id: "organizers", name: "Организаторлар", icon: "clipboard", active: true, order: 3 },
  { id: "hosts", name: "Той жүргізушілер", icon: "mic", active: true, order: 4 },
  { id: "photo", name: "Фото", icon: "camera", active: true, order: 5 },
  { id: "video", name: "Видео", icon: "video", active: true, order: 6 },
  { id: "mobile", name: "Мобилографтар", icon: "phone", active: true, order: 7 },
  { id: "decor", name: "Декор", icon: "sparkles", active: true, order: 8 },
  { id: "flowers", name: "Гүл безендіру", icon: "sparkles", active: true, order: 9 },
  { id: "music", name: "Музыка / DJ", icon: "music", active: true, order: 10 },
  { id: "asaba", name: "Асаба", icon: "mic", active: true, order: 11 },
  { id: "catering", name: "Кейтеринг", icon: "utensils", active: true, order: 12 },
  { id: "cortege", name: "Кортеж / cars", icon: "car", active: true, order: 13 },
  { id: "beauty", name: "Makeup / beauty", icon: "user", active: true, order: 14 },
  { id: "dress", name: "Dresses / suits", icon: "heart", active: true, order: 15 },
  { id: "cakes", name: "Cakes / desserts", icon: "cake", active: true, order: 16 },
  { id: "invites", name: "Invitation designers", icon: "send", active: true, order: 17 },
  { id: "sound-light", name: "Sound/light equipment", icon: "settings", active: true, order: 18 },
  { id: "show", name: "Dance/show programs", icon: "star", active: true, order: 19 },
  { id: "uzatu", name: "Қыз ұзату services", icon: "heart", active: true, order: 20 },
  { id: "betashar", name: "Беташар services", icon: "music", active: true, order: 21 },
  { id: "traditional", name: "Traditional services", icon: "star", active: true, order: 22 },
];

export const ABOUT_CONTENT = {
  title: "TOI.KZ — Қазақстандағы тойды жоспарлауға арналған premium PWA",
  intro:
    "TOI.KZ тойханалар, қызмет көрсетушілер, бронь, қонақтар, бюджет, чеклист және digital шақыруды бір қауіпсіз мобильді workspace-ке біріктіреді.",
  fromOldSite:
    "Ескі сайттағы идея сақталды: Қазақстандағы той, үйлену той, ұзату, сүндет той және беташарға арналған ресторандар мен сервистерді онлайн іздеу және брондау.",
  points: [
    "Клиенттерге: той күнін, бюджетті, қонақтарды, RSVP және броньдарды бір жерде бақылау.",
    "Vendor-ларға: қызметтерді жариялау, өтінімдерді көру, бос күндерді басқару және пікірлермен жұмыс істеу.",
    "Admin-ға: vendor moderation, service approval, booking бақылауы және қауіпсіз операциялық панель.",
  ],
};

const CATEGORY_DETAILS = {
  halls: {
    names: ["Royal Blue Hall", "Aq Saray Astana", "Grand Sapphire", "Shanyraq Palace", "Emerald Ballroom"],
    basePrice: 14000,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200",
    description: "Астанадағы premium банкет залы: үлкен сахна, LED экран, welcome zone және кәсіби банкет менеджері.",
    features: ["LED screen", "Halal menu", "Parking", "VIP room", "Stage"],
    capacity: 420,
  },
  restaurants: {
    names: ["Qazaq Gourmet", "Nomad Dinner Hall", "Saryarka Dastarhan", "Astana Garden", "Alem Restaurant"],
    basePrice: 11000,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&q=80&w=1200",
    description: "Қазақы және еуропалық ас мәзірі бар ресторан. Отбасылық тойға ыңғайлы, сервисі толық дайын.",
    features: ["Kazakh menu", "Terrace", "Kids room", "Parking", "Wi-Fi"],
    capacity: 280,
  },
  organizers: {
    names: ["Toi Pro Agency", "Aru Events", "Jas Otau Planning", "Blue Ribbon KZ", "Qonaq Creative"],
    basePrice: 350000,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    description: "Тойды толық жүргізетін ұйымдастыру командасы: смета, vendor coordination, тайминг және event day control.",
    features: ["Full planning", "Day coordinator", "Budget control", "Vendor brief", "Script"],
    capacity: null,
  },
  hosts: {
    names: ["Nursultan Host", "Aigerim Show", "Dauletten Live", "Samat Event Voice", "Mira Ceremony"],
    basePrice: 420000,
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200",
    description: "Қазақша, орысша және заманауи форматта той жүргізетін кәсіби host. Сценарий және интерактив кіреді.",
    features: ["KZ/RU", "Script", "Games", "Live coordination", "Family protocol"],
    capacity: null,
  },
  photo: {
    names: ["Aisha Photo", "Mereke Frames", "Otau Editorial", "Sapar Wedding", "Blue Lens Studio"],
    basePrice: 260000,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
    description: "Editorial wedding photo, love story және той күні толық репортаж. Preview 7 күн ішінде беріледі.",
    features: ["Love story", "Album", "Same week preview", "Retouch", "Cloud gallery"],
    capacity: null,
  },
  video: {
    names: ["Qadam Films", "Toi Cinema", "Astana Wedding Film", "Zheruyik Video", "Aq Tilek Production"],
    basePrice: 320000,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200",
    description: "Wedding film, teaser және толық той видеосы. Drone және multi-camera түсірілім қолжетімді.",
    features: ["Drone", "Teaser", "Full film", "Multi camera", "Color grading"],
    capacity: null,
  },
  mobile: {
    names: ["Reels Toi", "Moment Mobile", "TikTok Wedding KZ", "Qyzyq Reels", "Blue Story Maker"],
    basePrice: 90000,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
    description: "Той күні телефонмен стильді reels, stories және short video жасап беретін мобилограф қызметі.",
    features: ["Reels", "Same day edit", "Stories", "Vertical video", "Behind scenes"],
    capacity: null,
  },
  decor: {
    names: ["Blue Bloom Decor", "Alem Design", "Otau Stage", "Crystal Wedding Decor", "Qazaq Ornament"],
    basePrice: 280000,
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
    description: "Сахна, welcome zone, фотозона және үстел декоры. Premium dark blue / gold / floral бағыттары бар.",
    features: ["Stage", "Photo zone", "Welcome zone", "Table decor", "3D mockup"],
    capacity: null,
  },
  flowers: {
    names: ["Aru Flowers", "Gul Astana", "Orchid Toi", "Bloom Ceremony", "Ak Guldeste"],
    basePrice: 160000,
    image: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&q=80&w=1200",
    description: "Гүл безендіру, bridal bouquet, президиум және қонақ үстелдеріне композициялар.",
    features: ["Bouquet", "Presidium", "Table flowers", "Arch", "Fresh flowers"],
    capacity: null,
  },
  music: {
    names: ["Blue DJ", "Saz Live Band", "Astana Sound", "Qara Jorga Music", "Mereke DJ"],
    basePrice: 180000,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200",
    description: "DJ, live band және sound engineer. Қазақша, орысша, international playlist дайындалады.",
    features: ["DJ", "Live band", "Playlist", "Sound check", "MC support"],
    capacity: null,
  },
  asaba: {
    names: ["Asaba Erbol", "Qyzyq Asaba", "Aq Tilek Asaba", "Mereke Asaba", "Dastur Host"],
    basePrice: 300000,
    image: "https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?auto=format&fit=crop&q=80&w=1200",
    description: "Дәстүрді білетін асаба: беташар, тілек, бата, құда күту және заманауи интерактив.",
    features: ["Dastur", "Betashar", "Bata", "KZ/RU", "Family games"],
    capacity: null,
  },
  catering: {
    names: ["Dastarhan Catering", "Aq Niyet Food", "Premium Buffet KZ", "Nomad Catering", "Toi Kitchen"],
    basePrice: 8500,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200",
    description: "Үйде, залда немесе outdoor форматта catering. Halal menu және сервировка командасы бар.",
    features: ["Halal", "Buffet", "Servers", "Tableware", "Outdoor"],
    capacity: 300,
  },
  cortege: {
    names: ["Astana Cortege", "Elite Cars KZ", "Wedding Drive", "Blue Route", "Lux Auto Toi"],
    basePrice: 120000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    description: "Той кортежі: premium седан, SUV және ретро көліктер. Driver және decoration опциялары бар.",
    features: ["Driver", "Decor", "Premium cars", "Route plan", "Photo stop"],
    capacity: null,
  },
  beauty: {
    names: ["Aru Beauty", "Makeup Astana", "Bride Glow", "Sulu Studio", "Elite Hair KZ"],
    basePrice: 65000,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=1200",
    description: "Келін макияжы, шаш үлгісі, trial look және той күні early morning service.",
    features: ["Makeup", "Hair", "Trial", "On-site", "Touch-up"],
    capacity: null,
  },
  dress: {
    names: ["Otau Dress", "Aru Bridal", "Sultan Suits", "White Atelier", "Saukele Studio"],
    basePrice: 180000,
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&q=80&w=1200",
    description: "Келін көйлек, күйеу костюм, саукеле және аксессуарлар. Rental және custom tailoring бар.",
    features: ["Rental", "Custom", "Fitting", "Accessories", "Delivery"],
    capacity: null,
  },
  cakes: {
    names: ["Sweet Toi", "Aq Tattim", "Blue Cake Lab", "Mereke Dessert", "Astana Patisserie"],
    basePrice: 95000,
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=1200",
    description: "Wedding cake, dessert bar және ұлттық тәттілер. Доставка және дегустация мүмкіндігі бар.",
    features: ["Cake", "Dessert bar", "Tasting", "Delivery", "Custom design"],
    capacity: null,
  },
  invites: {
    names: ["Invite Studio", "Digital Otau", "Blue RSVP", "Aru Design", "Qazaq Invite"],
    basePrice: 45000,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1200",
    description: "Digital invitation, printed invitation, RSVP form және WhatsApp share-ready дизайн.",
    features: ["Digital", "Print", "RSVP", "QR", "WhatsApp"],
    capacity: null,
  },
  "sound-light": {
    names: ["Pro Light Astana", "Blue Stage Tech", "SoundLux KZ", "LED Toi", "Event Tech Pro"],
    basePrice: 220000,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=1200",
    description: "Sound, light, LED screen, smoke және technician support. Үлкен залдарға арналған set.",
    features: ["Sound", "Light", "LED", "Technician", "Smoke"],
    capacity: null,
  },
  show: {
    names: ["Qara Jorga Show", "Dance Art KZ", "Fire Show Astana", "Dombyra Fusion", "Kids Show Toi"],
    basePrice: 140000,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200",
    description: "Dance show, fire show, домбыра fusion және балалар бағдарламасы. Таймингке сай қойылады.",
    features: ["Dance", "Fire show", "Dombyra", "Kids", "Stage ready"],
    capacity: null,
  },
  uzatu: {
    names: ["Uzatu Ceremony", "Aru Uzatu", "Qyz Zholy", "Saukele Event", "Ak Bosaga"],
    basePrice: 240000,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    description: "Қыз ұзату сценарийі, декор, асаба, дәстүр және family coordination толық пакет.",
    features: ["Scenario", "Dastur", "Decor", "Asaba", "Family flow"],
    capacity: null,
  },
  betashar: {
    names: ["Betashar Pro", "Dombra Betashar", "Aq Zhol Ceremony", "Qazaq Saz", "Kelinshek Ritual"],
    basePrice: 90000,
    image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?auto=format&fit=crop&q=80&w=1200",
    description: "Беташар қызметі: домбыра, ән, мәтін, sound coordination және дәстүр бойынша жүргізу.",
    features: ["Dombra", "Song", "Text", "Sound", "Protocol"],
    capacity: null,
  },
  traditional: {
    names: ["Dastur Team", "Bata Ata", "Qudalyk Service", "Shashu Ceremony", "Tusau Kesu Pro"],
    basePrice: 70000,
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1200",
    description: "Қазақ дәстүрлері: құдалық, шашу, бата, тұсаукесер және family protocol бойынша кеңес.",
    features: ["Bata", "Shashu", "Qudalyk", "Protocol", "Consulting"],
    capacity: null,
  },
};

const DISTRICTS = ["Есіл", "Нұра", "Алматы ауданы", "Сарыарқа", "Байқоңыр"];
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
    const price = details.basePrice + itemIndex * Math.max(5000, Math.round(details.basePrice * 0.08));
    const rating = Number((4.55 + ((categoryIndex + itemIndex) % 5) * 0.08).toFixed(1));
    const id = `${category.id}-${toSlug(name)}`;
    return {
      id,
      ownerId: `vendor_seed_${id}`,
      businessName: name,
      title: name,
      category: category.name,
      categoryId: category.id,
      city: "Астана",
      district: DISTRICTS[(categoryIndex + itemIndex) % DISTRICTS.length],
      address: `Астана, ${DISTRICTS[(categoryIndex + itemIndex) % DISTRICTS.length]} ауданы, Мәңгілік Ел ${12 + itemIndex}`,
      description: details.description,
      priceFrom: price,
      capacity: details.capacity ? details.capacity + itemIndex * 30 : null,
      rating,
      reviewsCount: 38 + categoryIndex * 7 + itemIndex * 11,
      verified: itemIndex !== 4,
      featured: itemIndex === 0 || (categoryIndex + itemIndex) % 7 === 0,
      status: "approved",
      phone: `+7701${String(categoryIndex + 10).padStart(2, "0")}${String(itemIndex + 10000).slice(0, 5)}`,
      whatsapp: `7701${String(categoryIndex + 10).padStart(2, "0")}${String(itemIndex + 10000).slice(0, 5)}`,
      instagram: `${toSlug(name).replace(/-/g, ".")}.kz`,
      image: details.image,
      features: details.features,
      availableDates: DATE_SETS[itemIndex],
      availability: DATE_SETS[itemIndex],
      location: { lat: 51.128 + categoryIndex * 0.003 + itemIndex * 0.002, lng: 71.39 + categoryIndex * 0.002 - itemIndex * 0.001 },
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
  { id: "c6", group: "той күні", title: "Декор, фото, музыка және координатор check-in", done: false, dueDate: "2026-09-12", reminder: false },
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
  { id: "tl6", time: "23:30", title: "Финал", responsible: "Той жүргізуші", note: "" },
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
