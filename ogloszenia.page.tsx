// app/ogloszenia/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { getListings } from "@/lib/listings";
import { getMakesWithCount } from "@/lib/listings";
import { ListingCard, ListingCardSkeleton } from "@/components/listings/ListingCard";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { ListingSort } from "@/components/listings/ListingSort";
import { Pagination } from "@/components/ui/Pagination";
import type { ListingFilters as Filters, ListingSort as SortType } from "@/types";

export const metadata: Metadata = {
  title: "Ogłoszenia samochodowe",
  description: "Przeglądaj tysiące ogłoszeń samochodowych. Filtruj po marce, modelu, cenie, roku i przebiegu.",
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function sp(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

export default async function OgloszeniaPage({ searchParams }: PageProps) {
  const filters: Filters = {
    makeId:       sp(searchParams.makeId)       ? Number(sp(searchParams.makeId))       : undefined,
    modelId:      sp(searchParams.modelId)      ? Number(sp(searchParams.modelId))      : undefined,
    yearFrom:     sp(searchParams.yearFrom)     ? Number(sp(searchParams.yearFrom))     : undefined,
    yearTo:       sp(searchParams.yearTo)       ? Number(sp(searchParams.yearTo))       : undefined,
    priceFrom:    sp(searchParams.priceFrom)    ? Number(sp(searchParams.priceFrom))    : undefined,
    priceTo:      sp(searchParams.priceTo)      ? Number(sp(searchParams.priceTo))      : undefined,
    mileageTo:    sp(searchParams.mileageTo)    ? Number(sp(searchParams.mileageTo))    : undefined,
    fuelType:     sp(searchParams.fuelType),
    transmission: sp(searchParams.transmission),
    voivodeship:  sp(searchParams.voivodeship),
    query:        sp(searchParams.q),
    page:         sp(searchParams.page)         ? Number(sp(searchParams.page))         : 1,
    sort:         (sp(searchParams.sort) as SortType) ?? "newest",
  };

  const [{ listings, total, page, totalPages }, makes] = await Promise.all([
    getListings(filters),
    getMakesWithCount(),
  ]);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== "newest" && v !== 1
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page__layout">

          {/* Sidebar z filtrami */}
          <div className="page__sidebar">
            <Suspense>
              <ListingFilters makes={makes} />
            </Suspense>
          </div>

          {/* Wyniki */}
          <div className="page__main">

            {/* Nagłówek z wynikami */}
            <div className="results__header">
              <div className="results__meta">
                {filters.query ? (
                  <h1 className="results__title">
                    Wyniki dla: <em>"{filters.query}"</em>
                  </h1>
                ) : (
                  <h1 className="results__title">Ogłoszenia samochodowe</h1>
                )}
                <span className="results__count">
                  {total.toLocaleString("pl-PL")} ogłoszeń
                </span>
              </div>

              <Suspense>
                <ListingSort current={filters.sort ?? "newest"} />
              </Suspense>
            </div>

            {/* Aktywne filtry (tagi) */}
            {hasActiveFilters && (
              <ActiveFilterTags filters={filters} makes={makes} />
            )}

            {/* Siatka ogłoszeń */}
            {listings.length > 0 ? (
              <>
                <div className="results__grid" role="list" aria-label="Lista ogłoszeń">
                  {listings.map((listing) => (
                    <div key={listing.id} role="listitem">
                      <ListingCard listing={listing} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="results__pagination">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      searchParams={searchParams as Record<string, string>}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState hasFilters={hasActiveFilters} />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          padding: 32px 0 64px;
        }
        .page__layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 28px;
          align-items: start;
        }
        .page__sidebar {
          /* sticky jest w samym komponencie ListingFilters */
        }
        .page__main {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .results__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .results__meta {
          display: flex;
          align-items: baseline;
          gap: 12px;
          flex-wrap: wrap;
        }
        .results__title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.4px;
        }
        .results__title em {
          font-style: normal;
          color: var(--c-accent);
        }
        .results__count {
          font-size: 14px;
          color: var(--c-text-muted);
        }
        .results__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 16px;
        }
        .results__pagination {
          margin-top: 8px;
        }
        @media (max-width: 900px) {
          .page__layout {
            grid-template-columns: 1fr;
          }
          .page__sidebar {
            order: 2;
          }
          .page__main {
            order: 1;
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
// Aktywne filtry jako tagi
// ─────────────────────────────────────────

function ActiveFilterTags({
  filters,
  makes,
}: {
  filters: Filters;
  makes: Awaited<ReturnType<typeof getMakesWithCount>>;
}) {
  const tags: { label: string; paramKey: string }[] = [];

  if (filters.makeId) {
    const make = makes.find((m) => m.id === filters.makeId);
    if (make) tags.push({ label: make.name, paramKey: "makeId" });
  }
  if (filters.yearFrom || filters.yearTo) {
    tags.push({
      label: `${filters.yearFrom ?? "?"} – ${filters.yearTo ?? "?"}`,
      paramKey: "year",
    });
  }
  if (filters.priceFrom || filters.priceTo) {
    tags.push({
      label: `${filters.priceFrom?.toLocaleString("pl-PL") ?? "0"} – ${filters.priceTo?.toLocaleString("pl-PL") ?? "∞"} zł`,
      paramKey: "price",
    });
  }
  if (filters.fuelType) {
    const labels: Record<string, string> = {
      PETROL: "Benzyna", DIESEL: "Diesel", ELECTRIC: "Elektryczny",
      HYBRID: "Hybryda", LPG: "LPG",
    };
    tags.push({ label: labels[filters.fuelType] ?? filters.fuelType, paramKey: "fuelType" });
  }
  if (filters.voivodeship) {
    tags.push({ label: filters.voivodeship, paramKey: "voivodeship" });
  }

  if (tags.length === 0) return null;

  return (
    <div className="active-filters" aria-label="Aktywne filtry">
      {tags.map((tag) => (
        <span key={tag.paramKey} className="active-filter">
          {tag.label}
        </span>
      ))}
      <style jsx>{`
        .active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .active-filter {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          background: var(--c-accent-light);
          color: var(--c-accent);
          border-radius: 20px;
          border: 1px solid #c0d8fc;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────
// Stan pusty
// ─────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="empty" role="status" aria-live="polite">
      <div className="empty__icon" aria-hidden="true">🔍</div>
      <h2 className="empty__title">
        {hasFilters ? "Brak wyników dla wybranych filtrów" : "Brak ogłoszeń"}
      </h2>
      <p className="empty__desc">
        {hasFilters
          ? "Spróbuj zmienić lub wyczyścić filtry, żeby zobaczyć więcej ogłoszeń."
          : "Jeszcze nie ma żadnych ogłoszeń. Dodaj pierwsze!"}
      </p>
      <style jsx>{`
        .empty {
          padding: 64px 32px;
          text-align: center;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
        }
        .empty__icon { font-size: 40px; margin-bottom: 16px; }
        .empty__title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px;
        }
        .empty__desc {
          font-size: 14px;
          color: var(--c-text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

// Skeleton dla Suspense
export function ListingsGridSkeleton() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: "16px",
    }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}
