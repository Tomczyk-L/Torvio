// components/listings/ListingSort.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Props = {
  current: string;
};

const SORT_OPTIONS = [
  { value: "newest",     label: "Najnowsze" },
  { value: "price_asc",  label: "Cena: od najniższej" },
  { value: "price_desc", label: "Cena: od najwyższej" },
  { value: "year_desc",  label: "Rok: najnowsze" },
  { value: "mileage_asc",label: "Przebieg: najmniejszy" },
];

export function ListingSort({ current }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="sort">
      <label htmlFor="sort-select" className="sort__label">Sortuj:</label>
      <select
        id="sort-select"
        className="sort__select"
        value={current}
        onChange={(e) => handleChange(e.target.value)}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <style jsx>{`
        .sort {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sort__label {
          font-size: 13px;
          color: var(--c-text-secondary);
          white-space: nowrap;
        }
        .sort__select {
          height: 34px;
          padding: 0 10px;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          color: var(--c-text-primary);
          background: var(--c-surface);
          cursor: pointer;
          font-family: var(--font-sans);
        }
        .sort__select:focus {
          border-color: var(--c-accent);
          outline: none;
        }
      `}</style>
    </div>
  );
}
