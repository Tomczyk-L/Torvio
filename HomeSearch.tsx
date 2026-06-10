// components/home/HomeSearch.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MakeWithModels } from "@/types";

type Props = { makes: MakeWithModels[] };

export function HomeSearch({ makes }: Props) {
  const router = useRouter();
  const [makeId, setMakeId]   = useState("");
  const [modelId, setModelId] = useState("");
  const [query, setQuery]     = useState("");

  const models = makes.find((m) => String(m.id) === makeId)?.models ?? [];

  function search() {
    const params = new URLSearchParams();
    if (makeId)  params.set("makeId",  makeId);
    if (modelId) params.set("modelId", modelId);
    if (query)   params.set("q", query);
    router.push(`/ogloszenia?${params.toString()}`);
  }

  return (
    <div className="search">
      <p className="search__label">Szukaj ogłoszenia</p>

      <div className="search__row">
        <select
          className="search__select"
          value={makeId}
          onChange={(e) => { setMakeId(e.target.value); setModelId(""); }}
          aria-label="Marka pojazdu"
        >
          <option value="">Wszystkie marki</option>
          {makes.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select
          className="search__select"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          disabled={!makeId}
          aria-label="Model pojazdu"
        >
          <option value="">Wszystkie modele</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      <input
        type="search"
        className="search__input"
        placeholder='Szukaj po słowach: "Golf TDI navi"'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && search()}
        aria-label="Szukaj ogłoszeń"
      />

      <button className="search__btn" onClick={search}>
        Szukaj ogłoszeń
      </button>

      <style jsx>{`
        .search { display: flex; flex-direction: column; gap: 10px; }
        .search__label {
          font-size: 14px;
          font-weight: 700;
          color: var(--c-text-primary);
          margin: 0;
        }
        .search__row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .search__select,
        .search__input {
          height: 44px;
          padding: 0 14px;
          border: 1.5px solid var(--c-border);
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-family: var(--font-sans);
          color: var(--c-text-primary);
          background: var(--c-bg);
          width: 100%;
          transition: border-color var(--transition);
        }
        .search__select:focus,
        .search__input:focus {
          border-color: var(--c-accent);
          outline: none;
        }
        .search__select:disabled { opacity: 0.5; }
        .search__btn {
          height: 48px;
          background: var(--c-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background var(--transition);
          width: 100%;
        }
        .search__btn:hover { background: var(--c-accent-hover); }
      `}</style>
    </div>
  );
}
