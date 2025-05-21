import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout/ClientLayout";
import Chat from "@/components/Chatbot";
import { NextIntlClientProvider } from "next-intl";
import { i18n, localeTranslations } from "../i18n";

import { getLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata({ params }) {
  const locale = i18n.defaultLocale;
  const messages = localeTranslations[locale] || localeTranslations.en;

  return {
    title: messages.Home?.title || "Sbonssy | Empower Your Passion for Sports",
    description:
      messages.Home?.description ||
      "Shop exclusive deals that directly support sport ambassadors — from athletes and coaches to teams and creators. Join the movement and make an impact with every purchase.",
  };
}

export default async function RootLayout({ children, params }) {
  // const locale = params?.locale || i18n.defaultLocale;
  const locale = await getLocale();
  // const locale = await getLocale();

  const messages = localeTranslations[locale] || localeTranslations.en;

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {children}
            {/* <SocketProvider>{children}</SocketProvider> */}
          </ClientLayout>
          <Chat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
