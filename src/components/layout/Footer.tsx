// components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{
      background: "#0F1117",
      color: "rgba(255,255,255,0.7)",
      marginTop: "80px",
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        gap: "64px",
        paddingTop: "48px",
        paddingBottom: "48px",
      }}>
        <div style={{ flexShrink: 0, width: "200px" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.4px" }}>
            Torvio
          </span>
          <p style={{ marginTop: "8px", fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.6)" }}>
            Kupuj i sprzedawaj auta bez prowizji.
          </p>
        </div>

        <nav style={{ display: "flex", gap: "48px", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>
              Serwis
            </span>
            <Link href="/ogloszenia" style={{ color: "rgba(255,255,255,0.6)" }}>Ogłoszenia</Link>
            <Link href="/ogloszenia/nowe" style={{ color: "rgba(255,255,255,0.6)" }}>Dodaj ogłoszenie</Link>
            <Link href="/ogloszenia?fuelType=ELECTRIC" style={{ color: "rgba(255,255,255,0.6)" }}>Elektryczne</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>
              Konto
            </span>
            <Link href="/profil" style={{ color: "rgba(255,255,255,0.6)" }}>Moje ogłoszenia</Link>
            <Link href="/profil/wiadomosci" style={{ color: "rgba(255,255,255,0.6)" }}>Wiadomości</Link>
            <Link href="/profil/ulubione" style={{ color: "rgba(255,255,255,0.6)" }}>Obserwowane</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "2px" }}>
              Informacje
            </span>
            <Link href="/pomoc" style={{ color: "rgba(255,255,255,0.6)" }}>Pomoc</Link>
            <Link href="/regulamin" style={{ color: "rgba(255,255,255,0.6)" }}>Regulamin</Link>
            <Link href="/polityka-prywatnosci" style={{ color: "rgba(255,255,255,0.6)" }}>Prywatność</Link>
          </div>
        </nav>
      </div>

      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 0",
        fontSize: "12px",
        color: "rgba(255,255,255,0.35)",
        maxWidth: "1280px",
        margin: "0 auto",
        paddingLeft: "32px",
        paddingRight: "32px",
      }}>
        © {new Date().getFullYear()} Torvio. Wszystkie prawa zastrzeżone.
      </div>
    </footer>
  );
}
