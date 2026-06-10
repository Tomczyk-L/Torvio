// components/layout/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="header">
      <div className="container header__inner">

        {/* Logo */}
        <Link href="/" className="header__logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill="var(--c-accent)" />
            <path
              d="M6 18l4-8 4 5 3-3 5 6"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="20" cy="10" r="2" fill="white" opacity="0.7" />
          </svg>
          <span className="header__logo-text">Automarket</span>
        </Link>

        {/* Nawigacja */}
        <nav className="header__nav" aria-label="Główna nawigacja">
          <Link
            href="/ogloszenia"
            className={`header__nav-link ${pathname.startsWith("/ogloszenia") ? "header__nav-link--active" : ""}`}
          >
            Ogłoszenia
          </Link>
          <Link
            href="/ogloszenia?fuelType=ELECTRIC"
            className={`header__nav-link ${pathname.includes("fuelType=ELECTRIC") ? "header__nav-link--active" : ""}`}
          >
            Elektryczne
          </Link>
        </nav>

        {/* Akcje */}
        <div className="header__actions">
          <SignedIn>
            <Link href="/ogloszenia/nowe" className="btn btn--accent btn--sm">
              + Dodaj ogłoszenie
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Link href="/logowanie" className="btn btn--ghost btn--sm">
              Zaloguj się
            </Link>
            <Link href="/rejestracja" className="btn btn--accent btn--sm">
              Zarejestruj się
            </Link>
          </SignedOut>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--c-surface);
          border-bottom: 1px solid var(--c-border);
          backdrop-filter: blur(8px);
        }
        .header__inner {
          display: flex;
          align-items: center;
          gap: 32px;
          height: 60px;
        }
        .header__logo {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .header__logo-text {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.4px;
          color: var(--c-text-primary);
        }
        .header__nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        .header__nav-link {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 500;
          color: var(--c-text-secondary);
          transition: color var(--transition), background var(--transition);
        }
        .header__nav-link:hover {
          color: var(--c-text-primary);
          background: var(--c-bg);
        }
        .header__nav-link--active {
          color: var(--c-accent);
          background: var(--c-accent-light);
        }
        .header__actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          border-radius: var(--radius-sm);
          transition: all var(--transition);
          cursor: pointer;
          border: none;
          text-decoration: none;
        }
        .btn--sm {
          font-size: 13px;
          padding: 7px 14px;
          height: 34px;
        }
        .btn--accent {
          background: var(--c-accent);
          color: #fff;
        }
        .btn--accent:hover {
          background: var(--c-accent-hover);
        }
        .btn--ghost {
          background: transparent;
          color: var(--c-text-secondary);
          border: 1px solid var(--c-border);
        }
        .btn--ghost:hover {
          color: var(--c-text-primary);
          border-color: var(--c-border-dark);
          background: var(--c-bg);
        }
        @media (max-width: 640px) {
          .header__nav { display: none; }
        }
      `}</style>
    </header>
  );
}
