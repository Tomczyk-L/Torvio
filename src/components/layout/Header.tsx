// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "#fff",
      borderBottom: "1px solid #E4E7ED",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        gap: "32px",
        height: "60px",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, textDecoration: "none" }}>
          <div style={{
            width: "28px", height: "28px", background: "#1D6EF5",
            borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 10l3-6 3 4 2-2 4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "-0.4px", color: "#0F1117" }}>
            Torvio
          </span>
        </Link>

        {/* Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px", flex: 1 }}>
          <Link href="/ogloszenia" style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            color: pathname.startsWith("/ogloszenia") ? "#1D6EF5" : "#5A6070",
            background: pathname.startsWith("/ogloszenia") ? "#EBF1FE" : "transparent",
            textDecoration: "none",
          }}>
            Ogłoszenia
          </Link>
          <Link href="/ogloszenia?fuelType=ELECTRIC" style={{
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#5A6070",
            textDecoration: "none",
          }}>
            Elektryczne
          </Link>
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <SignedIn>
            <Link href="/ogloszenia/nowe" style={{
              fontSize: "13px", fontWeight: 500, padding: "7px 14px", height: "34px",
              background: "#1D6EF5", color: "#fff", borderRadius: "6px", textDecoration: "none",
              display: "flex", alignItems: "center",
            }}>
              + Dodaj ogłoszenie
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/logowanie" style={{
              fontSize: "13px", fontWeight: 500, padding: "7px 14px",
              background: "transparent", color: "#5A6070", borderRadius: "6px",
              border: "1px solid #E4E7ED", textDecoration: "none",
            }}>
              Zaloguj się
            </Link>
            <Link href="/rejestracja" style={{
              fontSize: "13px", fontWeight: 500, padding: "7px 14px",
              background: "#1D6EF5", color: "#fff", borderRadius: "6px", textDecoration: "none",
            }}>
              Zarejestruj się
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
