# Security Checklist

- [ ] Env values exist only in Vercel Project Settings and local `.env.local`.
- [ ] `.env.local`, service account JSON, private keys, and mobile Firebase config files are not committed.
- [ ] No hardcoded Firebase config fallback remains in source code.
- [ ] Firebase Realtime Database rules from `database.rules.json` are published.
- [ ] Firebase Storage rules from `storage.rules` are published before user uploads are enabled.
- [ ] Firebase Auth authorized domains include `localhost`, Vercel domains, and the production domain.
- [ ] Vercel HTTPS is enabled.
- [ ] Security headers are enabled through `next.config.js`.
- [ ] Service worker does not cache private routes, Firebase requests, non-GET requests, or authorized requests.
- [ ] Admin UIDs are configured under `admins/$uid: true` in Realtime Database.
- [ ] Old exposed Firebase keys are rotated or restricted in Google Cloud Console.
- [ ] `npm audit` has been reviewed and high/critical issues are resolved or documented.
