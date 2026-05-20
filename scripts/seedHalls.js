const fs = require("fs");
const path = require("path");

// Robust built-in parser to load .env.local variables
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split(/\r?\n/).forEach((line) => {
      const parts = line.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
} catch (e) {
  console.warn("Could not load .env.local:", e.message);
}

const hallsData = {
  "palazzo": {
    "id": "palazzo",
    "ownerId": "vendor_seed_palazzo",
    "businessName": "Palazzo Di Astana",
    "title": "Palazzo Di Astana",
    "category": "Залы",
    "city": "Астана",
    "district": "Есіл",
    "description": "Классический банкетный зал во дворцовом стиле в самом сердце столицы. Высокие потолки (8 метров), хрустальные люстры и безупречный сервис. Подходит для масштабных свадеб, қыз ұзату и правительственных приемов.",
    "priceFrom": 15000,
    "capacity": 500,
    "rating": 4.9,
    "reviewsCount": 3,
    "verified": true,
    "featured": true,
    "status": "approved",
    "phone": "+77001234567",
    "whatsapp": "77001234567",
    "instagram": "palazzo.astana",
    "image": "https://avatars.mds.yandex.net/get-altay/10355486/2a0000018a1a1a1a/orig",
    "features": ["Парковка на 100 машин", "Halal menu", "VIP-комнаты", "Сцена", "LED-экран 12x4м", "Гримерки"],
    "availableDates": ["2026-06-12", "2026-07-20", "2026-09-14"],
    "url2gis": "https://2gis.kz/astana/firm/70000001021469339",
    "reviews": [
      { "user": "Арман", "rating": 5, "date": "2 недели назад", "text": "Өте әдемі және кең зал. Қыз ұзату тойын өткіздік, бәрі жоғары деңгейде өтті. Дыбыс пен жарық сапасы өте жақсы, тамақтары өте дәмді екен." },
      { "user": "Динара", "rating": 5, "date": "Месяц назад", "text": "Шикарный банкетный зал! Высокие потолки, хрустальные люстры создают атмосферу дворца. Кухня изумительная, сервис на высшем уровне, официанты внимательные." },
      { "user": "Ильяс", "rating": 4, "date": "3 месяца назад", "text": "Красивый интерьер, большая парковка, хорошая аппаратура. Единственный минус — немного прохладно в VIP-зоне, но в целом всё отлично." }
    ]
  },
  "bakshasaray": {
    "id": "bakshasaray",
    "ownerId": "vendor_seed_bakshasaray",
    "businessName": "Бақшасарай",
    "title": "Бақшасарай",
    "category": "Рестораны",
    "city": "Алматы",
    "district": "Бостандық",
    "description": "Легендарный банкетный комплекс в КЦДС Атакент. Несколько залов (Gerey Khan, Pushkin, Small Hall). Уникальное сочетание восточного гостеприимства, изысканной казахской кухни и современных технологий.",
    "priceFrom": 18000,
    "capacity": 700,
    "rating": 5.0,
    "reviewsCount": 3,
    "verified": true,
    "featured": true,
    "status": "approved",
    "phone": "+77007654321",
    "whatsapp": "77007654321",
    "instagram": "bakshasaray.almaty",
    "image": "https://avatars.mds.yandex.net/get-altay/2818617/2a00000171a0b3a3c9b7b9f8f4a1a5b8b0a9/orig",
    "features": ["Собственная кондитерская", "Летняя терраса", "Детская игровая", "Сцена-трансформер", "Парковка", "Halal menu"],
    "availableDates": ["2026-06-02", "2026-08-11", "2026-10-05"],
    "url2gis": "https://2gis.kz/almaty/firm/9429940000785641",
    "reviews": [
      { "user": "Марат", "rating": 5, "date": "3 дня назад", "text": "Лучшее место в Алматы для больших тоев. Парковка огромная, места много, кондиционеры работают отлично." },
      { "user": "Гульназ", "rating": 5, "date": "10 дней назад", "text": "Сервис 10/10. Менеджеры помогают с любым вопросом, баурсаки горячие, мясо тает во рту." },
      { "user": "Асель", "rating": 5, "date": "Месяц назад", "text": "Алматыдағы ең керемет банкеттік кешендердің бірі. Бакшасарайдың Gerey Khan залында үйлену тойымыз өтті. Қонақтар риза болды." }
    ]
  },
  "aura": {
    "id": "aura",
    "ownerId": "vendor_seed_aura",
    "businessName": "Aura Palace",
    "title": "Aura Palace",
    "category": "Залы",
    "city": "Шымкент",
    "district": "Әл-Фараби",
    "description": "Один из самых востребованных банкетных залов Шымкента. Уютная атмосфера, современный дизайн, великолепное световое шоу и знаменитая южная кухня с лучшим бешбармаком.",
    "priceFrom": 10000,
    "capacity": 400,
    "rating": 4.8,
    "reviewsCount": 2,
    "verified": true,
    "featured": true,
    "status": "approved",
    "phone": "+77001112233",
    "whatsapp": "77001112233",
    "instagram": "aurapalace.kz",
    "image": "https://avatars.mds.yandex.net/get-altay/1932371/2a0000016e3c0e3e5b3e1c3e1e5e6b7c8a9d/orig",
    "features": ["Зона для фотосессий", "Световое шоу", "Мощные кондиционеры", "Парковка", "Сцена", "LED-экран"],
    "availableDates": ["2026-06-18", "2026-09-01", "2026-11-09"],
    "url2gis": "https://2gis.kz/shymkent/firm/70000001032398555",
    "reviews": [
      { "user": "Ербол", "rating": 5, "date": "Неделю назад", "text": "Бешбармак просто пушка! Гости были в восторге. Зал чистый, звук хороший, обслуживание на высоте." },
      { "user": "Бауыржан", "rating": 4, "date": "2 недели назад", "text": "Зал үлкен әрі ыңғайлы, кондиционерлер жақсы жұмыс істейді. Қонақтарға өте ұнады." }
    ]
  },
  "aisha-photo": {
    "id": "aisha-photo",
    "ownerId": "vendor_seed_aisha",
    "businessName": "Aisha Wedding Photo",
    "title": "Aisha Wedding Photo",
    "category": "Фото",
    "city": "Алматы",
    "district": "Медеу",
    "description": "Профессиональная свадебная фотография в стиле редакционных журналов. Снимаем той, қыз ұзату и құдалық. Первые готовые кадры (preview) предоставляются уже через 7 дней.",
    "priceFrom": 240000,
    "capacity": 0,
    "rating": 4.9,
    "reviewsCount": 2,
    "verified": true,
    "featured": false,
    "status": "approved",
    "phone": "+77005554433",
    "whatsapp": "77005554433",
    "instagram": "aisha.photo",
    "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200",
    "features": ["Съемка Love Story", "Фотокнига", "Аэросъемка (дрон)", "Печать фото на мероприятии"],
    "availableDates": ["2026-06-04", "2026-07-19", "2026-09-21"],
    "url2gis": "https://2gis.kz/almaty/search/%D1%84%D0%BE%D1%82%D0%BE%D1%81%D0%B5%D1%81%D1%81%D0%B8%D1%8F",
    "reviews": [
      { "user": "Мадина", "rating": 5, "date": "Месяц назад", "text": "Фото өте сапалы шықты. Кадрлар табиғи, әдемі. Свадебная фотосессия прошла легко и непринужденно." },
      { "user": "Канат", "rating": 5, "date": "2 месяца назад", "text": "Профессионал своего дела. Фотографии получили очень быстро, качество огонь!" }
    ]
  },
  "arman-tamada": {
    "id": "arman-tamada",
    "ownerId": "vendor_seed_arman",
    "businessName": "Arman Show",
    "title": "Arman Show",
    "category": "Тамада",
    "city": "Астана",
    "district": "Сарыарқа",
    "description": "Харизматичный двуязычный ведущий (казахский, русский) для вашего торжества. Авторские интерактивы, современная шоу-программа без устаревших конкурсов и координация тайминга.",
    "priceFrom": 450000,
    "capacity": 0,
    "rating": 4.7,
    "reviewsCount": 2,
    "verified": true,
    "featured": false,
    "status": "approved",
    "phone": "+77002223344",
    "whatsapp": "77002223344",
    "instagram": "arman.show",
    "image": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=1200",
    "features": ["Ведение на казахском и русском", "Собственная шоу-программа", "Живой вокал", "Написание индивидуального сценария"],
    "availableDates": ["2026-06-27", "2026-08-08", "2026-10-10"],
    "url2gis": "https://2gis.kz/astana/search/%D1%82%D0%B0%D0%BC%D0%B0%D0%B4%D0%B0",
    "reviews": [
      { "user": "Алия", "rating": 5, "date": "3 недели назад", "text": "Арман тойды өте жоғары деңгейде жүргізді. Интеллигентный, веселый, все гости были в восторге от программы!" },
      { "user": "Данияр", "rating": 4, "date": "1 месяц назад", "text": "Отличный тамада, хорошо держит публику. Шоу-программа современная и динамичная." }
    ]
  }
};

const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL;

const DB_URL = databaseUrl
  ? `${databaseUrl.replace(/\/$/, "")}/Halls.json`
  : null;

async function seed() {
  if (!DB_URL) {
    throw new Error("Missing NEXT_PUBLIC_FIREBASE_DATABASE_URL or FIREBASE_DATABASE_URL. Example: https://your_project-default-rtdb.firebaseio.com");
  }

  console.log("Seeding database at:", DB_URL);

  try {
    const res = await fetch(DB_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hallsData)
    });
    if (res.ok) {
      console.log("Database seeded successfully!");
    } else {
      console.error("Error seeding DB:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

seed();
