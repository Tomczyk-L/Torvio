// components/listings/ListingCard.tsx
import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatMileage, fuelTypeLabel, timeAgo } from "@/lib/utils";
import type { ListingCard as ListingCardType } from "@/types";

type Props = {
  listing: ListingCardType;
};

export function ListingCard({ listing }: Props) {
  const {
    slug,
    title,
    price,
    year,
    mileage,
    fuelType,
    city,
    voivodeship,
    isFeatured,
    createdAt,
    coverImage,
  } = listing;

  return (
    <Link href={`/ogloszenia/${slug}`} className="card">
      {/* Zdjęcie */}
      <div className="card__image-wrap">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="card__image"
          />
        ) : (
          <div className="card__image-placeholder" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l2-4h14l2 4M3 9v9a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1V9M3 9h18" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7.5" cy="13" r="1" fill="currentColor"/>
              <circle cx="16.5" cy="13" r="1" fill="currentColor"/>
            </svg>
          </div>
        )}

        {isFeatured && (
          <span className="card__badge card__badge--featured" aria-label="Ogłoszenie wyróżnione">
            Wyróżnione
          </span>
        )}
      </div>

      {/* Treść */}
      <div className="card__body">
        <div className="card__price">{formatPrice(price)}</div>
        <h3 className="card__title">{title}</h3>

        {/* Parametry */}
        <ul className="card__params" aria-label="Parametry pojazdu">
          <li className="card__param">
            <span className="card__param-icon" aria-hidden="true">📅</span>
            {year}
          </li>
          <li className="card__param">
            <span className="card__param-icon" aria-hidden="true">🛣️</span>
            {formatMileage(mileage)}
          </li>
          <li className="card__param">
            <span className="card__param-icon" aria-hidden="true">⛽</span>
            {fuelTypeLabel(fuelType)}
          </li>
        </ul>

        {/* Lokalizacja i data */}
        <div className="card__footer">
          <span className="card__location">
            {city}, {voivodeship}
          </span>
          <time
            className="card__date"
            dateTime={new Date(createdAt).toISOString()}
          >
            {timeAgo(new Date(createdAt))}
          </time>
        </div>
      </div>

      <style jsx>{`
        .card {
          display: flex;
          flex-direction: column;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: box-shadow var(--transition), border-color var(--transition), transform var(--transition);
          text-decoration: none;
          color: inherit;
        }
        .card:hover {
          box-shadow: var(--shadow-md);
          border-color: var(--c-border-dark);
          transform: translateY(-2px);
        }
        .card__image-wrap {
          position: relative;
          aspect-ratio: 4/3;
          background: var(--c-bg);
          overflow: hidden;
        }
        .card__image {
          object-fit: cover;
          transition: transform 300ms ease;
        }
        .card:hover .card__image {
          transform: scale(1.03);
        }
        .card__image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-border-dark);
        }
        .card__badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.02em;
        }
        .card__badge--featured {
          background: var(--c-featured);
          color: #fff;
        }
        .card__body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .card__price {
          font-size: 20px;
          font-weight: 700;
          color: var(--c-text-primary);
          letter-spacing: -0.5px;
        }
        .card__title {
          font-size: 14px;
          font-weight: 500;
          color: var(--c-text-secondary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card__params {
          display: flex;
          gap: 12px;
          list-style: none;
          margin: 6px 0 0;
          padding: 0;
          flex-wrap: wrap;
        }
        .card__param {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--c-text-secondary);
        }
        .card__param-icon {
          font-size: 11px;
        }
        .card__footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid var(--c-border);
        }
        .card__location {
          font-size: 12px;
          color: var(--c-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
        }
        .card__date {
          font-size: 11px;
          color: var(--c-text-muted);
          flex-shrink: 0;
        }
      `}</style>
    </Link>
  );
}

/** Skeleton do ładowania */
export function ListingCardSkeleton() {
  return (
    <div className="card-skeleton" aria-hidden="true">
      <div className="skeleton" style={{ aspectRatio: "4/3" }} />
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div className="skeleton" style={{ height: "26px", width: "55%" }} />
        <div className="skeleton" style={{ height: "16px", width: "80%" }} />
        <div className="skeleton" style={{ height: "14px", width: "65%", marginTop: "4px" }} />
      </div>
      <style jsx>{`
        .card-skeleton {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
