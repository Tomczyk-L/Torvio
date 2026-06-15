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

      
    </div>
  );
}
