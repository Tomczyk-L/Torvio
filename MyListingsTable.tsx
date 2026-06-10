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

      <style jsx>{`
        .table-wrap {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          text-align: left;
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 600;
          color: var(--c-text-muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--c-bg);
          border-bottom: 1px solid var(--c-border);
        }
        td { padding: 12px 16px; border-bottom: 1px solid var(--c-border); vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--c-bg); }
        .row--loading { opacity: 0.5; pointer-events: none; }
        .listing-cell { display: flex; align-items: center; gap: 12px; }
        .listing-thumb {
          position: relative;
          width: 56px;
          height: 42px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .listing-thumb__empty { font-size: 18px; }
        .listing-name {
          display: block;
          font-weight: 600;
          color: var(--c-text-primary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 220px;
        }
        .listing-name:hover { color: var(--c-accent); }
        .listing-meta { font-size: 11px; color: var(--c-text-muted); }
        .price-cell { font-weight: 700; white-space: nowrap; }
        .views-cell { color: var(--c-text-secondary); }
        .status {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .status--active  { background: var(--c-success-bg);  color: var(--c-success); }
        .status--draft   { background: var(--c-bg);           color: var(--c-text-muted); border: 1px solid var(--c-border); }
        .status--sold    { background: var(--c-accent-light); color: var(--c-accent); }
        .status--expired { background: var(--c-warning-bg);   color: var(--c-warning); }
        .actions { display: flex; gap: 4px; }
        .action-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid var(--c-border);
          background: transparent;
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all var(--transition);
          text-decoration: none;
          color: inherit;
        }
        .action-btn:hover { background: var(--c-bg); border-color: var(--c-border-dark); }
        .action-btn--danger:hover { background: var(--c-danger-bg); border-color: var(--c-danger); }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
