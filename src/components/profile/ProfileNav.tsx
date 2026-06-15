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

      
    </nav>
  );
}
