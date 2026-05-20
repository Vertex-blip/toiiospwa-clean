import { LanguageProvider } from "@/components/LanguageContext";
import ClientBoot from "@/components/ClientBoot";
import "./globals.css";

export const metadata = {
  title: "toi.kz — premium PWA для организации мероприятий",
  description: "Каталог услуг, бронирование, гости, бюджет и планирование тоя в Казахстане.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "toi.kz",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon-180.png", sizes: "180x180" },
      { url: "/icons/apple-touch-icon-167.png", sizes: "167x167" },
      { url: "/icons/apple-touch-icon-152.png", sizes: "152x152" },
    ],
  },
};

export const viewport = {
  themeColor: "#080807",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="toi.kz" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <ClientBoot />
      </body>
    </html>
  );
}
        <link rel="icon" href="/favicon.ico" />
