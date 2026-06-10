// app/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getFeaturedListings, getMakesWithCount, getListings } from "@/lib/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { HomeSearch } from "@/components/home/HomeSearch";

export const metadata: Metadata = {
  title: "Automarket — ogłoszenia samochodowe bez prowizji",
  description: "Kupuj i sprzedawaj auta bez prowizji. Tysiące ogłoszeń samochodowych w całej Polsce.",
};

export default async function HomePage() {
  const [featured, makes, { total }] = await Promise.all([
    getFeaturedListings(6),
    getMakesWithCount(),
    getListings({ perPage: 1 }),
  ]);

  const popularMakes = makes
    .filter((m) => m._count.listings > 0)
    .sort((a, b) => b._count.listings - a._count.listings)
    .slice(0, 8);

  return (
    <div className="home">

      {/* ── HERO ─────────────────────────── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero__inner">
            <div className="hero__text">
              <p className="hero__eyebrow">Nowy sposób na kupno auta</p>
              <h1 id="hero-heading" className="hero__title">
                Znajdź swoje<br />
                <span className="hero__accent">wymarzone auto</span>
              </h1>
              <p className="hero__sub">
                {total.toLocaleString("pl-PL")} ogłoszeń w Polsce.
                Bez prowizji, bez pośredników.
              </p>
            </div>
            <div className="hero__search">
              <HomeSearch makes={makes} />
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULARNE MARKI ──────────────── */}
      <section className="makes-section" aria-labelledby="makes-heading">
        <div className="container">
          <h2 id="makes-heading" className="section-title">Popularne marki</h2>
          <div className="makes-grid" role="list">
            {popularMakes.map((make) => (
              <Link
                key={make.id}
                href={`/ogloszenia?makeId=${make.id}`}
                className="make-card"
                role="listitem"
              >
                <span className="make-name">{make.name}</span>
                <span className="make-count">{make._count.listings} ogłoszeń</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WYRÓŻNIONE OGŁOSZENIA ─────────── */}
      {featured.length > 0 && (
        <section className="featured-section" aria-labelledby="featured-heading">
          <div className="container">
            <div className="section-header">
              <h2 id="featured-heading" className="section-title">Wyróżnione ogłoszenia</h2>
              <Link href="/ogloszenia?sort=newest" className="see-all">
                Zobacz wszystkie →
              </Link>
            </div>
            <div className="listings-grid" role="list" aria-label="Wyróżnione ogłoszenia">
              {featured.map((listing) => (
                <div key={listing.id} role="listitem">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NAJNOWSZE OGŁOSZENIA ──────────── */}
      <RecentListingsSection />

      {/* ── CTA ──────────────────────────── */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta">
            <div className="cta__text">
              <h2 id="cta-heading" className="cta__title">Sprzedajesz auto?</h2>
              <p className="cta__sub">
                Dodaj ogłoszenie w 2 minuty. Bez prowizji, bez opłat za wystawienie.
                Ogłoszenie aktywne przez 30 dni.
              </p>
            </div>
            <Link href="/ogloszenia/nowe" className="cta__btn">
              Dodaj ogłoszenie za darmo
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home { padding-bottom: 0; }

        /* Hero */
        .hero {
          background: linear-gradient(135deg, #0f1117 0%, #1a2035 100%);
          padding: 64px 0 72px;
          overflow: hidden;
        }
        .hero__inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .hero__eyebrow {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-accent);
          margin: 0 0 16px;
        }
        .hero__title {
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -1px;
          color: #fff;
          margin: 0 0 20px;
        }
        .hero__accent { color: #60a5fa; }
        .hero__sub {
          font-size: 16px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          line-height: 1.6;
        }
        .hero__search {
          background: #fff;
          border-radius: var(--radius-xl);
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
        }

        /* Makes */
        .makes-section { padding: 48px 0 0; }
        .section-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.5px;
          margin: 0 0 20px;
        }
        .makes-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .make-card {
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 16px 20px;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          transition: all var(--transition);
          text-decoration: none;
        }
        .make-card:hover {
          border-color: var(--c-accent);
          box-shadow: var(--shadow-sm);
          transform: translateY(-1px);
        }
        .make-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--c-text-primary);
        }
        .make-count {
          font-size: 12px;
          color: var(--c-text-muted);
        }

        /* Featured */
        .featured-section { padding: 48px 0 0; }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .section-header .section-title { margin-bottom: 0; }
        .see-all {
          font-size: 14px;
          font-weight: 500;
          color: var(--c-accent);
        }
        .see-all:hover { text-decoration: underline; }
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        /* CTA */
        .cta-section { padding: 64px 0; margin-top: 48px; }
        .cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          background: var(--c-text-primary);
          border-radius: var(--radius-xl);
          padding: 40px 48px;
        }
        .cta__title {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #fff;
          margin: 0 0 10px;
        }
        .cta__sub {
          font-size: 15px;
          color: rgba(255,255,255,0.6);
          margin: 0;
          max-width: 480px;
          line-height: 1.6;
        }
        .cta__btn {
          flex-shrink: 0;
          padding: 14px 28px;
          background: var(--c-accent);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-weight: 700;
          transition: background var(--transition);
          white-space: nowrap;
        }
        .cta__btn:hover { background: var(--c-accent-hover); }

        @media (max-width: 900px) {
          .hero__inner { grid-template-columns: 1fr; }
          .makes-grid { grid-template-columns: repeat(2, 1fr); }
          .listings-grid { grid-template-columns: repeat(2, 1fr); }
          .cta { flex-direction: column; align-items: flex-start; padding: 32px; }
        }
        @media (max-width: 600px) {
          .makes-grid { grid-template-columns: repeat(2, 1fr); }
          .listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}

// ── Najnowsze ogłoszenia (osobny async) ──

async function RecentListingsSection() {
  const { listings } = await getListings({ sort: "newest", perPage: 6 });
  if (listings.length === 0) return null;

  return (
    <section style={{ padding: "48px 0 0" }} aria-labelledby="recent-heading">
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2 id="recent-heading" style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
            Najnowsze ogłoszenia
          </h2>
          <Link href="/ogloszenia" style={{ fontSize: "14px", fontWeight: 500, color: "var(--c-accent)" }}>
            Zobacz wszystkie →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }} role="list">
          {listings.map((l) => (
            <div key={l.id} role="listitem"><ListingCard listing={l} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
