import Link from "next/link";
import { getFeaturedListings, getMakesWithCount, getListings } from "@/lib/listings";
import { ListingCard } from "@/components/listings/ListingCard";
import { HomeSearch } from "@/components/home/HomeSearch";

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
    <div>
      <section style={{ background: "linear-gradient(135deg, #0f1117 0%, #1a2035 100%)", padding: "64px 0 72px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1D6EF5", margin: "0 0 16px" }}>
                Nowy sposób na kupno auta
              </p>
              <h1 style={{ fontSize: "48px", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-1px", color: "#fff", margin: "0 0 20px" }}>
                Znajdź swoje<br />
                <span style={{ color: "#60a5fa" }}>wymarzone auto</span>
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                {total.toLocaleString("pl-PL")} ogłoszeń w Polsce. Bez prowizji, bez pośredników.
              </p>
            </div>
            <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
              <HomeSearch makes={makes} />
            </div>
          </div>
        </div>
      </section>

      {popularMakes.length > 0 && (
        <section style={{ padding: "48px 0 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", margin: "0 0 20px" }}>
              Popularne marki
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
              {popularMakes.map((make) => (
                <Link key={make.id} href={`/ogloszenia?makeId=${make.id}`} style={{
                  display: "flex", flexDirection: "column", gap: "3px", padding: "16px 20px",
                  background: "#fff", border: "1px solid #E4E7ED", borderRadius: "14px", textDecoration: "none",
                }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#0F1117" }}>{make.name}</span>
                  <span style={{ fontSize: "12px", color: "#8E95A3" }}>{make._count.listings} ogłoszeń</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section style={{ padding: "48px 0 0" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px", margin: 0 }}>
                Wyróżnione ogłoszenia
              </h2>
              <Link href="/ogloszenia" style={{ fontSize: "14px", fontWeight: 500, color: "#1D6EF5", textDecoration: "none" }}>
                Zobacz wszystkie
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {featured.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding: "64px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: "32px", background: "#0F1117", borderRadius: "20px", padding: "40px 48px",
          }}>
            <div>
              <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>
                Sprzedajesz auto?
              </h2>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                Dodaj ogłoszenie w 2 minuty. Bez prowizji, bez opłat za wystawienie.
              </p>
            </div>
            <Link href="/ogloszenia/nowe" style={{
              flexShrink: 0, padding: "14px 28px", background: "#1D6EF5",
              color: "#fff", borderRadius: "6px", fontSize: "15px", fontWeight: 700, textDecoration: "none",
            }}>
              Dodaj ogłoszenie za darmo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
