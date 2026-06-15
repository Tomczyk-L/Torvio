// components/listings/ListingFilters.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { VOIVODESHIPS } from "@/lib/utils";
import type { MakeWithModels } from "@/types";

type Props = {
  makes: MakeWithModels[];
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 35 }, (_, i) => CURRENT_YEAR - i);

const FUEL_TYPES = [
  { value: "PETROL",   label: "Benzyna" },
  { value: "DIESEL",   label: "Diesel" },
  { value: "ELECTRIC", label: "Elektryczny" },
  { value: "HYBRID",   label: "Hybryda" },
  { value: "LPG",      label: "LPG" },
];

const TRANSMISSIONS = [
  { value: "MANUAL",    label: "Manualna" },
  { value: "AUTOMATIC", label: "Automatyczna" },
];

export function ListingFilters({ makes }: Props) {
  const router    = useRouter();
  const pathname  = usePathname();
  const searchParams = useSearchParams();

  // Stan formularza
  const [makeId,       setMakeId]       = useState(searchParams.get("makeId") ?? "");
  const [modelId,      setModelId]      = useState(searchParams.get("modelId") ?? "");
  const [yearFrom,     setYearFrom]     = useState(searchParams.get("yearFrom") ?? "");
  const [yearTo,       setYearTo]       = useState(searchParams.get("yearTo") ?? "");
  const [priceFrom,    setPriceFrom]    = useState(searchParams.get("priceFrom") ?? "");
  const [priceTo,      setPriceTo]      = useState(searchParams.get("priceTo") ?? "");
  const [mileageTo,    setMileageTo]    = useState(searchParams.get("mileageTo") ?? "");
  const [fuelType,     setFuelType]     = useState(searchParams.get("fuelType") ?? "");
  const [transmission, setTransmission] = useState(searchParams.get("transmission") ?? "");
  const [voivodeship,  setVoivodeship]  = useState(searchParams.get("voivodeship") ?? "");

  // Modele dla wybranej marki
  const selectedMake = makes.find((m) => String(m.id) === makeId);
  const models = selectedMake?.models ?? [];

  // Reset modelu przy zmianie marki
  useEffect(() => { setModelId(""); }, [makeId]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams();
    if (makeId)       params.set("makeId", makeId);
    if (modelId)      params.set("modelId", modelId);
    if (yearFrom)     params.set("yearFrom", yearFrom);
    if (yearTo)       params.set("yearTo", yearTo);
    if (priceFrom)    params.set("priceFrom", priceFrom);
    if (priceTo)      params.set("priceTo", priceTo);
    if (mileageTo)    params.set("mileageTo", mileageTo);
    if (fuelType)     params.set("fuelType", fuelType);
    if (transmission) params.set("transmission", transmission);
    if (voivodeship)  params.set("voivodeship", voivodeship);
    // Zachowaj zapytanie tekstowe jeśli było
    const q = searchParams.get("q");
    if (q) params.set("q", q);

    router.push(`${pathname}?${params.toString()}`);
  }, [makeId, modelId, yearFrom, yearTo, priceFrom, priceTo, mileageTo,
      fuelType, transmission, voivodeship, pathname, router, searchParams]);

  const clearFilters = () => {
    setMakeId(""); setModelId(""); setYearFrom(""); setYearTo("");
    setPriceFrom(""); setPriceTo(""); setMileageTo("");
    setFuelType(""); setTransmission(""); setVoivodeship("");
    router.push(pathname);
  };

  const hasFilters = [makeId, modelId, yearFrom, yearTo, priceFrom, priceTo,
                      mileageTo, fuelType, transmission, voivodeship].some(Boolean);

  return (
    <aside className="filters" aria-label="Filtry wyszukiwania">
      <div className="filters__header">
        <h2 className="filters__title">Filtry</h2>
        {hasFilters && (
          <button
            className="filters__clear"
            onClick={clearFilters}
            type="button"
          >
            Wyczyść
          </button>
        )}
      </div>

      {/* Marka i model */}
      <section className="filters__section">
        <label className="filters__label" htmlFor="makeId">Marka</label>
        <select
          id="makeId"
          className="filters__select"
          value={makeId}
          onChange={(e) => setMakeId(e.target.value)}
        >
          <option value="">Wszystkie marki</option>
          {makes.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} {(m as any)._count.listings > 0 ? `(${(m as any)._count.listings})` : ""}
            </option>
          ))}
        </select>

        {models.length > 0 && (
          <>
            <label className="filters__label" htmlFor="modelId" style={{ marginTop: "10px" }}>
              Model
            </label>
            <select
              id="modelId"
              className="filters__select"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
            >
              <option value="">Wszystkie modele</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </>
        )}
      </section>

      {/* Cena */}
      <section className="filters__section">
        <span className="filters__label">Cena (PLN)</span>
        <div className="filters__range">
          <input
            type="number"
            placeholder="Od"
            className="filters__input"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            min={0}
            aria-label="Cena od"
          />
          <span className="filters__range-sep">–</span>
          <input
            type="number"
            placeholder="Do"
            className="filters__input"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            min={0}
            aria-label="Cena do"
          />
        </div>
      </section>

      {/* Rok */}
      <section className="filters__section">
        <span className="filters__label">Rok produkcji</span>
        <div className="filters__range">
          <select
            className="filters__select"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            aria-label="Rok od"
          >
            <option value="">Od</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="filters__range-sep">–</span>
          <select
            className="filters__select"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            aria-label="Rok do"
          >
            <option value="">Do</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </section>

      {/* Przebieg */}
      <section className="filters__section">
        <label className="filters__label" htmlFor="mileageTo">Przebieg do (km)</label>
        <input
          id="mileageTo"
          type="number"
          placeholder="np. 150 000"
          className="filters__input filters__input--full"
          value={mileageTo}
          onChange={(e) => setMileageTo(e.target.value)}
          min={0}
        />
      </section>

      {/* Paliwo */}
      <section className="filters__section">
        <span className="filters__label">Rodzaj paliwa</span>
        <div className="filters__chips">
          {FUEL_TYPES.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`filters__chip ${fuelType === f.value ? "filters__chip--active" : ""}`}
              onClick={() => setFuelType(fuelType === f.value ? "" : f.value)}
              aria-pressed={fuelType === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Skrzynia biegów */}
      <section className="filters__section">
        <span className="filters__label">Skrzynia biegów</span>
        <div className="filters__chips">
          {TRANSMISSIONS.map((t) => (
            <button
              key={t.value}
              type="button"
              className={`filters__chip ${transmission === t.value ? "filters__chip--active" : ""}`}
              onClick={() => setTransmission(transmission === t.value ? "" : t.value)}
              aria-pressed={transmission === t.value}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* Województwo */}
      <section className="filters__section">
        <label className="filters__label" htmlFor="voivodeship">Województwo</label>
        <select
          id="voivodeship"
          className="filters__select"
          value={voivodeship}
          onChange={(e) => setVoivodeship(e.target.value)}
        >
          <option value="">Cała Polska</option>
          {VOIVODESHIPS.map((v) => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
      </section>

      {/* Przycisk */}
      <button
        type="button"
        className="filters__submit"
        onClick={applyFilters}
      >
        Szukaj ogłoszeń
      </button>

      
    </aside>
  );
}
