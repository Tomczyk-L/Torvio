// components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">Automarket</span>
          <p className="footer__tagline">
            Kupuj i sprzedawaj auta bez prowizji.
          </p>
        </div>

        <nav className="footer__links" aria-label="Linki w stopce">
          <div className="footer__col">
            <span className="footer__col-title">Serwis</span>
            <Link href="/ogloszenia">Ogłoszenia</Link>
            <Link href="/ogloszenia/nowe">Dodaj ogłoszenie</Link>
            <Link href="/ogloszenia?fuelType=ELECTRIC">Elektryczne</Link>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Konto</span>
            <Link href="/profil">Moje ogłoszenia</Link>
            <Link href="/profil/wiadomosci">Wiadomości</Link>
            <Link href="/profil/ulubione">Obserwowane</Link>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Informacje</span>
            <Link href="/pomoc">Pomoc</Link>
            <Link href="/regulamin">Regulamin</Link>
            <Link href="/polityka-prywatnosci">Prywatność</Link>
          </div>
        </nav>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} Automarket. Wszystkie prawa zastrzeżone.</span>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--c-text-primary);
          color: rgba(255,255,255,0.7);
          margin-top: 80px;
        }
        .footer__inner {
          display: flex;
          gap: 64px;
          padding-top: 48px;
          padding-bottom: 48px;
        }
        .footer__brand {
          flex-shrink: 0;
          width: 200px;
        }
        .footer__logo {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.4px;
        }
        .footer__tagline {
          margin-top: 8px;
          font-size: 13px;
          line-height: 1.6;
        }
        .footer__links {
          display: flex;
          gap: 48px;
          flex: 1;
        }
        .footer__col {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
        }
        .footer__col a {
          color: rgba(255,255,255,0.6);
          transition: color var(--transition);
        }
        .footer__col a:hover {
          color: #fff;
        }
        .footer__col-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 2px;
        }
        .footer__bottom {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 16px 0;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
        }
        @media (max-width: 768px) {
          .footer__inner { flex-direction: column; gap: 32px; }
          .footer__brand { width: auto; }
          .footer__links { flex-wrap: wrap; gap: 32px; }
        }
      `}</style>
    </footer>
  );
}
