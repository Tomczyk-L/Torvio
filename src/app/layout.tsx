export const dynamic = 'force-dynamic';

// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { plPL } from "@clerk/localizations";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Automarket — ogłoszenia samochodowe",
    template: "%s | Automarket",
  },
  description:
    "Kupuj i sprzedawaj auta bez prowizji. Tysiące ogłoszeń samochodowych w całej Polsce.",
  keywords: ["ogłoszenia samochodowe", "kupno samochodu", "sprzedaż auta", "używane auta"],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Automarket",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={plPL}>
      <html lang="pl" className={inter.variable}>
        <body>
          <Header />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
