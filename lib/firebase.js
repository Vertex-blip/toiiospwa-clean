import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate that all required Firebase configuration values are present
if (!firebaseConfig.apiKey) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_API_KEY");
if (!firebaseConfig.authDomain) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
if (!firebaseConfig.databaseURL) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_DATABASE_URL");
if (!firebaseConfig.projectId) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID");
if (!firebaseConfig.storageBucket) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
if (!firebaseConfig.messagingSenderId) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
if (!firebaseConfig.appId) throw new Error("Missing required environment variable: NEXT_PUBLIC_FIREBASE_APP_ID");

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
