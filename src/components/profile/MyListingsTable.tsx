// components/profile/MyListingsTable.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatPrice, formatMileage, statusLabel } from "@/lib/utils";

type Listing = {
  id: string;
  slug: string;
  title: string;
  price: number;
  mileage: number;
  status: string;
  viewsCount: number;
  createdAt: Date;
  make: { name: string };
  model: { name: string };
  images: { url: string }[];
};

type Props = { listings: Listing[] };

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:  "status--active",
  DRAFT:   "status--draft",
  SOLD:    "status--sold",
  EXPIRED: "status--expired",
};

export function MyListingsTable({ listings }: Props) {
  const [items, setItems] = useState(listings);
  const [loading, setLoading] = useState<string | null>(null);

  async function markSold(id: string) {
    if (!confirm("Oznaczyć ogłoszenie jako sprzedane?")) return;
    setLoading(id);
    await fetch(`/api/listings/${id}/sold`, { method: "POST" });
    setItems((prev) => prev.map((l) => l.id === id ? { ...l, status: "SOLD" } : l));
    setLoading(null);
  }

  async function remove(id: string) {
    if (!confirm("Usunąć ogłoszenie? Tej operacji nie można cofnąć.")) return;
    setLoading(id);
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((l) => l.id !== id));
    setLoading(null);
  }

  return (
    <div className="table-wrap">
      <table className="table" aria-label="Moje ogłoszenia">
        <thead>
          <tr>
            <th scope="col">Pojazd</th>
            <th scope="col">Cena</th>
            <th scope="col">Status</th>
            <th scope="col">Wyświetlenia</th>
            <th scope="col">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {items.map((listing) => (
            <tr key={listing.id} className={loading === listing.id ? "row--loading" : ""}>

              {/* Pojazd */}
              <td>
                <div className="listing-cell">
                  <div className="listing-thumb">
                    {listing.images[0] ? (
                      <Image
                        src={listing.images[0].url}
                        alt=""
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span className="listing-thumb__empty" aria-hidden="true">🚗</span>
                    )}
                  </div>
                  <div>
                    <Link href={`/ogloszenia/${listing.slug}`} className="listing-name">
                      {listing.title}
                    </Link>
                    <span className="listing-meta">
                      {formatMileage(listing.mileage)} ·{" "}
                      {new Date(listing.createdAt).toLocaleDateString("pl-PL")}
                    </span>
                  </div>
                </div>
              </td>

              {/* Cena */}
              <td className="price-cell">{formatPrice(listing.price)}</td>

              {/* Status */}
              <td>
                <span className={`status ${STATUS_COLORS[listing.status] ?? ""}`}>
                  {statusLabel(listing.status)}
                </span>
              </td>

              {/* Wyświetlenia */}
              <td className="views-cell">
                {listing.viewsCount.toLocaleString("pl-PL")}
              </td>

              {/* Akcje */}
              <td>
                <div className="actions">
                  <Link href={`/ogloszenia/${listing.slug}`} className="action-btn" aria-label="Podgląd">
                    👁
                  </Link>
                  {listing.status === "ACTIVE" && (
                    <button
                      className="action-btn"
                      onClick={() => markSold(listing.id)}
                      disabled={loading === listing.id}
                      aria-label="Oznacz jako sprzedane"
                      title="Sprzedane"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    className="action-btn action-btn--danger"
                    onClick={() => remove(listing.id)}
                    disabled={loading === listing.id}
                    aria-label="Usuń ogłoszenie"
                    title="Usuń"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
    </div>
  );
}
