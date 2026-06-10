// components/profile/ProfileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/profil",            label: "Moje ogłoszenia", icon: "📋" },
  { href: "/profil/ulubione",   label: "Obserwowane",     icon: "♡"  },
  { href: "/profil/wiadomosci", label: "Wiadomości",      icon: "✉️"  },
  { href: "/profil/ustawienia", label: "Ustawienia",      icon: "⚙️"  },
];

export function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Nawigacja profilu">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`nav-item ${active ? "nav-item--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="nav-item__icon" aria-hidden="true">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}

      <style jsx>{`
        nav { display: flex; flex-direction: column; gap: 2px; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          color: var(--c-text-secondary);
          transition: all var(--transition);
          text-decoration: none;
        }
        .nav-item:hover { background: var(--c-bg); color: var(--c-text-primary); }
        .nav-item--active { background: var(--c-accent-light); color: var(--c-accent); }
        .nav-item__icon { font-size: 15px; width: 18px; text-align: center; }
      `}</style>
    </nav>
  );
}
