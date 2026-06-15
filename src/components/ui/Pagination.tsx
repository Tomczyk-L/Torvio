"use client";

// components/ui/Pagination.tsx
import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  searchParams: Record<string, string>;
};

export function Pagination({ page, totalPages, searchParams }: Props) {
  function buildHref(p: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(p));
    return `?${params.toString()}`;
  }

  // Generuj zakres widocznych stron: zawsze pierwsza, ostatnia + okolice bieżącej
  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className="pagination" aria-label="Paginacja">
      {/* Poprzednia */}
      {page > 1 ? (
        <Link href={buildHref(page - 1)} className="pagination__btn" aria-label="Poprzednia strona">
          ←
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled" aria-disabled="true">←</span>
      )}

      {/* Numery stron */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`pagination__btn ${p === page ? "pagination__btn--active" : ""}`}
            aria-label={`Strona ${p}`}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Następna */}
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} className="pagination__btn" aria-label="Następna strona">
          →
        </Link>
      ) : (
        <span className="pagination__btn pagination__btn--disabled" aria-disabled="true">→</span>
      )}

      
    </nav>
  );
}
