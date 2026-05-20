# Security Policy

## Reporting vulnerabilities

Please report security issues privately to the project owner or repository maintainers. Do not open a public issue with exploit details, secrets, tokens, or user data.

## Secrets policy

- Never commit `.env`, `.env.local`, service account JSON files, private keys, or Firebase Admin SDK credentials.
- Firebase Web SDK `NEXT_PUBLIC_FIREBASE_*` values are public by design. Real protection must come from Firebase Auth, Realtime Database rules, Storage rules, and restricted Google Cloud API keys.
- If Firebase keys or service credentials were ever committed, rotate or restrict them immediately in Google Cloud Console and update Vercel environment variables.

## Firebase rules

- Realtime Database rules live in `database.rules.json`.
- Storage rules live in `storage.rules`.
- Frontend role checks are for UI only. Real admin enforcement must use `admins/$uid === true` in Firebase rules.

## Deployment checklist

Before production deploy:

- Store all environment variables in Vercel Project Settings.
- Publish Firebase Realtime Database rules.
- Publish Firebase Storage rules before enabling uploads.
- Configure Firebase Auth authorized domains for localhost, Vercel preview domains, and the production domain.
- Run `npm audit`, review high/critical findings, and keep `next` and `firebase` patched.
