# toi.kz / toiiospwa

Premium PWA для организации мероприятий в Казахстане на Next.js App Router, React 18 и Firebase Web SDK.

Проект теперь включает три рабочих кабинета:

- Client app: `/menu/home`, `/menu/halls`, `/menu/plan`, `/menu/booking`, `/menu/profile`
- Vendor cabinet: `/vendor`, `/vendor/orders`, `/vendor/profile`, `/vendor/services`, `/vendor/calendar`, `/vendor/reviews`, `/vendor/messages`, `/vendor/settings`
- Admin panel: `/admin`, `/admin/users`, `/admin/vendors`, `/admin/services`, `/admin/bookings`, `/admin/categories`, `/admin/cities`, `/admin/messages`, `/admin/reviews`, `/admin/complaints`, `/admin/content`, `/admin/analytics`, `/admin/settings`

UI построен в едином dark premium стиле: soft gold accents, clean cards, responsive bottom navigation, desktop sidebar, modal/toast states и mobile safe-area.

## Quick Start

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

Для production build:

```bash
npm run build
npm start
```

## Auth And Roles

MVP UI поддерживает role-based session для трех ролей:

- `client`: организация тоя, каталог, план, брони, профиль
- `vendor`: заявки, профиль услуги, сервисы, календарь, отзывы, сообщения
- `admin`: пользователи, vendors, сервисы, брони, категории, города, контент, жалобы, аналитика

Важно: frontend role используется только для UX и маршрутизации. Production security должна быть реализована через Firebase Auth, custom claims или `admins/{uid}: true`, Realtime Database Rules и Storage Rules.

Admin login route: `/admin/login`.

## Product Features

Client MVP:

- Dashboard with event status, days left, progress and quick actions
- Catalog with search, category/city filters, verified toggle, sort and vendor cards
- Hall/vendor detail modal, WhatsApp/phone links, compare action
- Booking request flow with status tracking
- Plan section: guests, invitations/RSVP link, budget, checklist, seating planner, timeline
- Profile, notifications, logout

Vendor MVP:

- Dashboard metrics
- Accept/decline/suggest/update booking statuses
- Business profile editor
- Services create/publish/unpublish
- Busy date calendar
- Reviews/messages/settings screens

Admin MVP:

- Metrics dashboard
- Users list, block/unblock, role change UI
- Vendor approve/reject/verify/feature
- Service publish/hide
- Booking status moderation
- Categories/cities active toggle
- Messages read state, review moderation, complaints resolution
- Content/settings editor

Data for MVP is persisted in browser localStorage through `lib/appStore.js`. It is structured to match the Firebase production model.

## Environment Variables

Create `.env.local` locally from `.env.example` and fill it with Firebase Web App config from Firebase Console.

Required variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Do not commit `.env.local`, `.env.production`, service account JSON files, private keys, or Firebase Admin SDK credentials.

`NEXT_PUBLIC_FIREBASE_*` values are visible in the browser by design. Real protection is:

- Firebase Auth
- Firebase Realtime Database Rules
- Firebase Storage Rules
- Vercel env variables
- Google Cloud API key restrictions
- No secrets in GitHub
- Service worker does not cache private data

If real Firebase keys were ever committed to GitHub history, deleting them from files is not enough. Rotate or restrict the exposed Firebase API key in Google Cloud Console, update Vercel env variables, and redeploy.

## Firebase Rules

Realtime Database rules are stored in `database.rules.json`.

Publish manually:

1. Firebase Console
2. Realtime Database
3. Rules
4. Paste `database.rules.json`
5. Publish

Storage rules are stored in `storage.rules`. Publish them before enabling production uploads.

Admin access is enforced through:

```text
admins/$uid === true
```

## Vercel Setup

1. Open Vercel Project Settings -> Environment Variables.
2. Add every required `NEXT_PUBLIC_FIREBASE_*` variable.
3. Open Firebase Console -> Authentication -> Settings -> Authorized domains.
4. Add `localhost`, Vercel preview domain and production domain.
5. Redeploy project.

Do not upload `.env.local` to GitHub.

## Security

Security hardening includes:

- No hardcoded Firebase fallback keys in `lib/firebase.js`
- Strict required env validation
- Security headers and Firebase-compatible CSP in `next.config.js`
- Private route protection through `hooks/useRequireAuth.js`
- Service worker network-only behavior for `/menu`, `/vendor`, `/admin`, Firebase requests, non-GET requests and authorized requests
- Input sanitization helpers in `lib/sanitize.js`
- Realtime Database rules for users, events, vendors, services, bookings, plan data, invitations, notifications and messages
- `SECURITY.md` and `docs/SECURITY_CHECKLIST.md`

Run checks:

```bash
npm install
npm run build
npm audit
```

## Project Structure

```text
app/
  page.js
  register/page.js
  admin/
  invite/[eventId]/
  menu/
  vendor/
components/
  AppShell.js
  AuthPage.js
  PlatformPages.js
lib/
  appData.js
  appStore.js
  firebase.js
  roles.js
  sanitize.js
  session.js
hooks/
  useRequireAuth.js
public/
  images/toi-login-bg.png
  manifest.json
  sw.js
database.rules.json
storage.rules
SECURITY.md
docs/SECURITY_CHECKLIST.md
```
