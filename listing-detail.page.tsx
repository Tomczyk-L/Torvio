// app/ogloszenia/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListingBySlug, getSimilarListings } from "@/lib/listings";
import { formatPrice, formatMileage, fuelTypeLabel, transmissionLabel, timeAgo } from "@/lib/utils";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingCard } from "@/components/listings/ListingCard";
import { ContactForm } from "@/components/listings/ContactForm";
import { FavouriteButton } from "@/components/listings/FavouriteButton";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return { title: "Ogłoszenie nie istnieje" };
  return {
    title: `${listing.title} — ${formatPrice(listing.price)}`,
    description: listing.description.slice(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.slice(0, 160),
      images: listing.images[0] ? [{ url: listing.images[0].url }] : [],
    },
  };
}

export default async function ListingPage({ params }: Props) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const similar = await getSimilarListings(listing, 4);

  const specs = [
    { label: "Rok produkcji",    value: String(listing.year) },
    { label: "Przebieg",         value: formatMileage(listing.mileage) },
    { label: "Rodzaj paliwa",    value: fuelTypeLabel(listing.fuelType) },
    { label: "Skrzynia biegów",  value: transmissionLabel(listing.transmission) },
    ...(listing.engineCc ? [{ label: "Pojemność silnika", value: `${(listing.engineCc / 1000).toFixed(1)} l` }] : []),
    ...(listing.powerHp  ? [{ label: "Moc",               value: `${listing.powerHp} KM` }] : []),
    ...(listing.color    ? [{ label: "Kolor",              value: listing.color }] : []),
    ...(listing.doors    ? [{ label: "Liczba drzwi",       value: String(listing.doors) }] : []),
    ...(listing.seats    ? [{ label: "Liczba miejsc",      value: String(listing.seats) }] : []),
    { label: "Nadwozie",         value: listing.model.bodyType ?? "—" },
  ];

  return (
    <div className="page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Nawigacja okruszkowa">
          <a href="/ogloszenia">Ogłoszenia</a>
          <span aria-hidden="true">›</span>
          <a href={`/ogloszenia?makeId=${listing.makeId}`}>{listing.make.name}</a>
          <span aria-hidden="true">›</span>
          <a href={`/ogloszenia?makeId=${listing.makeId}&modelId=${listing.modelId}`}>
            {listing.model.name}
          </a>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{listing.title}</span>
        </nav>

        <div className="layout">

          {/* Lewa kolumna — galeria + opis */}
          <div className="col-main">
            <ListingGallery images={listing.images} title={listing.title} />

            {/* Opis */}
            <section className="card" aria-labelledby="desc-heading">
              <h2 id="desc-heading" className="section-title">Opis</h2>
              <p className="description">{listing.description}</p>
            </section>

            {/* Parametry techniczne */}
            <section className="card" aria-labelledby="specs-heading">
              <h2 id="specs-heading" className="section-title">Dane techniczne</h2>
              <dl className="specs">
                {specs.map((s) => (
                  <div key={s.label} className="spec-row">
                    <dt className="spec-label">{s.label}</dt>
                    <dd className="spec-value">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* Prawa kolumna — cena, sprzedający, kontakt */}
          <aside className="col-aside">

            {/* Cena i akcje */}
            <div className="card price-card">
              <div className="price-row">
                <span className="price">{formatPrice(listing.price)}</span>
                <FavouriteButton listingId={listing.id} />
              </div>
              <h1 className="listing-title">{listing.title}</h1>
              <div className="listing-meta">
                <span className="listing-location">
                  📍 {listing.city}, {listing.voivodeship}
                </span>
                <span className="listing-date">
                  Dodano: {timeAgo(new Date(listing.createdAt))}
                </span>
              </div>
              <div className="listing-stats">
                <span>{listing.viewsCount.toLocaleString("pl-PL")} wyświetleń</span>
                {listing.isFeatured && <span className="badge-featured">Wyróżnione</span>}
              </div>
            </div>

            {/* Sprzedający */}
            <div className="card seller-card">
              <h2 className="section-title">Sprzedający</h2>
              <div className="seller">
                <div className="seller-avatar" aria-hidden="true">
                  {listing.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="seller-info">
                  <span className="seller-name">{listing.user.name}</span>
                  <span className="seller-since">
                    Na Automarket od {new Date(listing.user.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Formularz kontaktowy */}
            <div className="card">
              <h2 className="section-title">Skontaktuj się</h2>
              <ContactForm
                listingId={listing.id}
                receiverId={listing.user.id}
                sellerPhone={listing.user.phone}
              />
            </div>

          </aside>
        </div>

        {/* Podobne ogłoszenia */}
        {similar.length > 0 && (
          <section className="similar" aria-labelledby="similar-heading">
            <h2 id="similar-heading" className="similar-title">Podobne ogłoszenia</h2>
            <div className="similar-grid">
              {similar.map((s) => <ListingCard key={s.id} listing={s} />)}
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        .page { padding: 24px 0 64px; }
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--c-text-muted);
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .breadcrumb a { color: var(--c-text-secondary); }
        .breadcrumb a:hover { color: var(--c-accent); }
        .breadcrumb span[aria-current] { color: var(--c-text-primary); font-weight: 500; }
        .layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: start;
        }
        .col-main { display: flex; flex-direction: column; gap: 16px; }
        .col-aside { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 80px; }
        .card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 16px;
          letter-spacing: -0.3px;
        }
        .description {
          font-size: 14px;
          line-height: 1.75;
          color: var(--c-text-secondary);
          white-space: pre-wrap;
        }
        .specs { display: flex; flex-direction: column; gap: 0; }
        .spec-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid var(--c-border);
          gap: 16px;
        }
        .spec-row:last-child { border-bottom: none; }
        .spec-label { font-size: 13px; color: var(--c-text-secondary); }
        .spec-value { font-size: 13px; font-weight: 600; text-align: right; }
        .price-card {}
        .price-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .price { font-size: 28px; font-weight: 800; letter-spacing: -0.8px; }
        .listing-title { font-size: 17px; font-weight: 600; margin: 0 0 10px; line-height: 1.3; }
        .listing-meta { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
        .listing-location, .listing-date { font-size: 13px; color: var(--c-text-secondary); }
        .listing-stats { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--c-text-muted); }
        .badge-featured {
          background: var(--c-featured);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .seller { display: flex; align-items: center; gap: 12px; }
        .seller-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--c-accent-light);
          color: var(--c-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .seller-info { display: flex; flex-direction: column; gap: 2px; }
        .seller-name { font-size: 14px; font-weight: 600; }
        .seller-since { font-size: 12px; color: var(--c-text-muted); }
        .similar { margin-top: 48px; }
        .similar-title { font-size: 20px; font-weight: 700; margin: 0 0 20px; letter-spacing: -0.4px; }
        .similar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        @media (max-width: 900px) {
          .layout { grid-template-columns: 1fr; }
          .col-aside { position: static; }
        }
      `}</style>
    </div>
  );
}
