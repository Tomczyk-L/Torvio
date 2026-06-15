"use client";

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
      
    </div>
  );
}
