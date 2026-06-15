// components/listings/NewListingForm.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { VOIVODESHIPS } from "@/lib/utils";
import type { MakeWithModels } from "@/types";

type Props = { makes: MakeWithModels[] };

type FormData = {
  makeId:       string;
  modelId:      string;
  year:         string;
  mileage:      string;
  price:        string;
  fuelType:     string;
  transmission: string;
  engineCc:     string;
  powerHp:      string;
  color:        string;
  doors:        string;
  seats:        string;
  vin:          string;
  description:  string;
  city:         string;
  voivodeship:  string;
};

const EMPTY: FormData = {
  makeId: "", modelId: "", year: "", mileage: "", price: "",
  fuelType: "PETROL", transmission: "MANUAL",
  engineCc: "", powerHp: "", color: "", doors: "", seats: "",
  vin: "", description: "", city: "", voivodeship: "",
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

const COLORS = [
  "Biały", "Czarny", "Szary", "Srebrny", "Czerwony", "Niebieski",
  "Zielony", "Beżowy", "Brązowy", "Złoty", "Pomarańczowy", "Inny",
];

type Step = "details" | "photos" | "done";

export function NewListingForm({ makes }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [listingId, setListingId] = useState<string | null>(null);
  const [listingSlug, setListingSlug] = useState<string | null>(null);

  // Zdjęcia
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedMake = makes.find((m) => String(m.id) === form.makeId);
  const models = selectedMake?.models ?? [];

  function set(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    if (key === "makeId") setForm((f) => ({ ...f, makeId: value, modelId: "" }));
  }

  function validate(): boolean {
    const e: Partial<FormData> = {};
    if (!form.makeId)       e.makeId       = "Wybierz markę";
    if (!form.modelId)      e.modelId      = "Wybierz model";
    if (!form.year)         e.year         = "Podaj rok";
    if (!form.mileage)      e.mileage      = "Podaj przebieg";
    if (!form.price)        e.price        = "Podaj cenę";
    if (!form.description || form.description.length < 30)
                            e.description  = "Opis musi mieć co najmniej 30 znaków";
    if (!form.city)         e.city         = "Podaj miasto";
    if (!form.voivodeship)  e.voivodeship  = "Wybierz województwo";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submitDetails() {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          makeId:       Number(form.makeId),
          modelId:      Number(form.modelId),
          year:         Number(form.year),
          mileage:      Number(form.mileage),
          price:        Number(form.price),
          fuelType:     form.fuelType,
          transmission: form.transmission,
          engineCc:     form.engineCc     ? Number(form.engineCc)  : undefined,
          powerHp:      form.powerHp      ? Number(form.powerHp)   : undefined,
          color:        form.color        || undefined,
          doors:        form.doors        ? Number(form.doors)     : undefined,
          seats:        form.seats        ? Number(form.seats)     : undefined,
          vin:          form.vin          || undefined,
          description:  form.description,
          city:         form.city,
          voivodeship:  form.voivodeship,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setListingId(data.data.id);
        setListingSlug(data.data.slug);
        setStep("photos");
      } else {
        alert(data.error ?? "Błąd serwera");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 20 - photos.length);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...files]);
    setPhotoUrls((prev) => [...prev, ...urls]);
  }

  function removePhoto(i: number) {
    URL.revokeObjectURL(photoUrls[i]);
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
    setPhotoUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function uploadPhotos() {
    if (!listingId || photos.length === 0) {
      await activateListing();
      return;
    }
    setUploading(true);
    let done = 0;
    for (const file of photos) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch(`/api/listings/${listingId}/images`, { method: "POST", body: fd });
      done++;
      setUploadProgress(Math.round((done / photos.length) * 100));
    }
    await activateListing();
    setUploading(false);
  }

  async function activateListing() {
    if (!listingId) return;
    await fetch(`/api/listings/${listingId}/activate`, { method: "POST" });
    setStep("done");
  }

  // ─── KROK 1: Dane pojazdu ───────────────

  if (step === "details") {
    return (
      <div className="form">
        <div className="steps">
          <div className="step step--active"><span className="step-num">1</span> Dane pojazdu</div>
          <div className="step step--inactive"><span className="step-num">2</span> Zdjęcia</div>
        </div>

        {/* Marka i model */}
        <section className="section">
          <h2 className="section-title">Pojazd</h2>
          <div className="grid-2">
            <Field label="Marka *" error={errors.makeId}>
              <select className={`input ${errors.makeId ? "input--err" : ""}`}
                value={form.makeId} onChange={(e) => set("makeId", e.target.value)}>
                <option value="">Wybierz markę</option>
                {makes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <Field label="Model *" error={errors.modelId}>
              <select className={`input ${errors.modelId ? "input--err" : ""}`}
                value={form.modelId} onChange={(e) => set("modelId", e.target.value)}
                disabled={!form.makeId}>
                <option value="">Wybierz model</option>
                {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
          </div>
        </section>

        {/* Podstawowe parametry */}
        <section className="section">
          <h2 className="section-title">Parametry</h2>
          <div className="grid-3">
            <Field label="Rok produkcji *" error={errors.year}>
              <select className={`input ${errors.year ? "input--err" : ""}`}
                value={form.year} onChange={(e) => set("year", e.target.value)}>
                <option value="">Rok</option>
                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="Przebieg (km) *" error={errors.mileage}>
              <input type="number" className={`input ${errors.mileage ? "input--err" : ""}`}
                placeholder="np. 120000" value={form.mileage}
                onChange={(e) => set("mileage", e.target.value)} min={0} />
            </Field>
            <Field label="Cena (PLN) *" error={errors.price}>
              <input type="number" className={`input ${errors.price ? "input--err" : ""}`}
                placeholder="np. 45000" value={form.price}
                onChange={(e) => set("price", e.target.value)} min={0} />
            </Field>
          </div>

          {/* Paliwo */}
          <Field label="Rodzaj paliwa *" error={errors.fuelType}>
            <div className="chips">
              {FUEL_TYPES.map((f) => (
                <button key={f.value} type="button"
                  className={`chip ${form.fuelType === f.value ? "chip--active" : ""}`}
                  onClick={() => set("fuelType", f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Skrzynia */}
          <Field label="Skrzynia biegów *">
            <div className="chips">
              <button type="button"
                className={`chip ${form.transmission === "MANUAL" ? "chip--active" : ""}`}
                onClick={() => set("transmission", "MANUAL")}>Manualna</button>
              <button type="button"
                className={`chip ${form.transmission === "AUTOMATIC" ? "chip--active" : ""}`}
                onClick={() => set("transmission", "AUTOMATIC")}>Automatyczna</button>
            </div>
          </Field>
        </section>

        {/* Szczegóły techniczne */}
        <section className="section">
          <h2 className="section-title">Szczegóły techniczne <span className="optional">(opcjonalnie)</span></h2>
          <div className="grid-3">
            <Field label="Pojemność (cm³)">
              <input type="number" className="input" placeholder="np. 1968"
                value={form.engineCc} onChange={(e) => set("engineCc", e.target.value)} />
            </Field>
            <Field label="Moc (KM)">
              <input type="number" className="input" placeholder="np. 150"
                value={form.powerHp} onChange={(e) => set("powerHp", e.target.value)} />
            </Field>
            <Field label="Liczba drzwi">
              <select className="input" value={form.doors} onChange={(e) => set("doors", e.target.value)}>
                <option value="">—</option>
                {[2, 3, 4, 5].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Kolor">
              <select className="input" value={form.color} onChange={(e) => set("color", e.target.value)}>
                <option value="">—</option>
                {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Liczba miejsc">
              <select className="input" value={form.seats} onChange={(e) => set("seats", e.target.value)}>
                <option value="">—</option>
                {[2, 4, 5, 7, 8, 9].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="VIN">
              <input type="text" className="input" placeholder="17 znaków"
                value={form.vin} maxLength={17}
                onChange={(e) => set("vin", e.target.value.toUpperCase())} />
            </Field>
          </div>
        </section>

        {/* Opis */}
        <section className="section">
          <h2 className="section-title">Opis</h2>
          <Field label="Opis ogłoszenia *" error={errors.description}>
            <textarea
              className={`input input--textarea ${errors.description ? "input--err" : ""}`}
              placeholder="Opisz stan pojazdu, historię serwisową, wyposażenie i wszelkie ważne szczegóły…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={6}
              maxLength={3000}
            />
            <div className="char-count">{form.description.length}/3000</div>
          </Field>
        </section>

        {/* Lokalizacja */}
        <section className="section">
          <h2 className="section-title">Lokalizacja</h2>
          <div className="grid-2">
            <Field label="Miasto *" error={errors.city}>
              <input type="text" className={`input ${errors.city ? "input--err" : ""}`}
                placeholder="np. Warszawa" value={form.city}
                onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="Województwo *" error={errors.voivodeship}>
              <select className={`input ${errors.voivodeship ? "input--err" : ""}`}
                value={form.voivodeship} onChange={(e) => set("voivodeship", e.target.value)}>
                <option value="">Wybierz województwo</option>
                {VOIVODESHIPS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </Field>
          </div>
        </section>

        <button className="btn-submit" onClick={submitDetails} disabled={submitting} aria-busy={submitting}>
          {submitting ? "Zapisywanie…" : "Dalej: dodaj zdjęcia →"}
        </button>

        <FormStyles />
      </div>
    );
  }

  // ─── KROK 2: Zdjęcia ────────────────────

  if (step === "photos") {
    return (
      <div className="form">
        <div className="steps">
          <div className="step step--done"><span className="step-num">✓</span> Dane pojazdu</div>
          <div className="step step--active"><span className="step-num">2</span> Zdjęcia</div>
        </div>

        <section className="section">
          <h2 className="section-title">Zdjęcia pojazdu</h2>
          <p className="hint">Dodaj do 20 zdjęć. Pierwsze będzie zdjęciem głównym.</p>

          {/* Strefa uploadu */}
          <div
            className="dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
              const urls = files.map((f) => URL.createObjectURL(f));
              setPhotos((prev) => [...prev, ...files].slice(0, 20));
              setPhotoUrls((prev) => [...prev, ...urls].slice(0, 20));
            }}
            role="button"
            tabIndex={0}
            aria-label="Kliknij lub przeciągnij zdjęcia"
          >
            <span className="dropzone__icon" aria-hidden="true">📷</span>
            <span className="dropzone__text">Kliknij lub przeciągnij zdjęcia</span>
            <span className="dropzone__sub">JPG, PNG, WEBP — maks. 10 MB każde</span>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Podgląd zdjęć */}
          {photoUrls.length > 0 && (
            <div className="photo-grid" role="list" aria-label="Dodane zdjęcia">
              {photoUrls.map((url, i) => (
                <div key={url} className="photo-item" role="listitem">
                  {i === 0 && <span className="photo-cover" aria-label="Zdjęcie główne">Główne</span>}
                  <img src={url} alt={`Zdjęcie ${i + 1}`} className="photo-img" />
                  <button
                    className="photo-remove"
                    onClick={() => removePhoto(i)}
                    aria-label={`Usuń zdjęcie ${i + 1}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {uploading && (
            <div className="progress" role="progressbar" aria-valuenow={uploadProgress} aria-valuemin={0} aria-valuemax={100}>
              <div className="progress__bar" style={{ width: `${uploadProgress}%` }} />
              <span className="progress__label">Przesyłanie… {uploadProgress}%</span>
            </div>
          )}
        </section>

        <div className="form-actions">
          <button className="btn-secondary" onClick={() => setStep("details")} disabled={uploading}>
            ← Wróć
          </button>
          <button className="btn-submit btn-submit--flex" onClick={uploadPhotos} disabled={uploading} aria-busy={uploading}>
            {uploading ? `Przesyłanie ${uploadProgress}%…` : photos.length > 0 ? `Opublikuj z ${photos.length} zdjęciami` : "Opublikuj bez zdjęć"}
          </button>
        </div>

        <FormStyles />
      </div>
    );
  }

  // ─── KROK 3: Gotowe ─────────────────────

  return (
    <div className="done" role="status">
      <div className="done__icon" aria-hidden="true">🎉</div>
      <h2 className="done__title">Ogłoszenie zostało opublikowane!</h2>
      <p className="done__sub">Twoje ogłoszenie jest teraz widoczne dla wszystkich.</p>
      <div className="done__actions">
        <a href={`/ogloszenia/${listingSlug}`} className="btn-primary">
          Zobacz ogłoszenie
        </a>
        <a href="/profil" className="btn-secondary-link">
          Moje ogłoszenia
        </a>
      </div>
      
    </div>
  );
}

// ─── Helper: Field wrapper ───────────────

function Field({ label, error, children }: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      {children}
      {error && <span className="field__error" role="alert">{error}</span>}
      
    </div>
  );
}

// ─── Shared styles jako osobny komponent ─

function FormStyles() {
  return (
    <style jsx global>{`
      .form { display: flex; flex-direction: column; gap: 0; }
      .steps { display: flex; gap: 0; margin-bottom: 32px; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--c-border); }
      .step { flex: 1; padding: 12px 20px; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px; background: var(--c-bg); color: var(--c-text-muted); border-right: 1px solid var(--c-border); }
      .step:last-child { border-right: none; }
      .step--active { background: var(--c-accent-light); color: var(--c-accent); }
      .step--done { background: var(--c-success-bg); color: var(--c-success); }
      .step-num { width: 22px; height: 22px; border-radius: 50%; background: currentColor; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
      .step--active .step-num { background: var(--c-accent); color: #fff; }
      .step--done .step-num { background: var(--c-success); color: #fff; }
      .step--inactive .step-num { background: var(--c-border-dark); color: var(--c-text-muted); }
      .section { background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); padding: 20px 24px; margin-bottom: 16px; }
      .section-title { font-size: 15px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.2px; }
      .optional { font-size: 12px; font-weight: 400; color: var(--c-text-muted); }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px; }
      @media (max-width: 600px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }
      .input {
        height: 40px; padding: 0 12px; border: 1px solid var(--c-border);
        border-radius: var(--radius-sm); font-size: 14px; font-family: var(--font-sans);
        color: var(--c-text-primary); background: var(--c-bg); width: 100%;
        transition: border-color var(--transition);
      }
      .input:focus { border-color: var(--c-accent); outline: none; }
      .input--err { border-color: var(--c-danger); }
      .input--textarea { height: auto; padding: 10px 12px; resize: vertical; line-height: 1.6; }
      .char-count { font-size: 11px; color: var(--c-text-muted); text-align: right; margin-top: 4px; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; }
      .chip { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--c-border); background: var(--c-bg); font-size: 13px; font-weight: 500; color: var(--c-text-secondary); cursor: pointer; transition: all var(--transition); }
      .chip:hover { border-color: var(--c-accent); color: var(--c-accent); }
      .chip--active { background: var(--c-accent-light); border-color: var(--c-accent); color: var(--c-accent); }
      .hint { font-size: 13px; color: var(--c-text-secondary); margin: 0 0 16px; }
      .dropzone {
        border: 2px dashed var(--c-border-dark); border-radius: var(--radius-lg);
        padding: 40px 24px; text-align: center; cursor: pointer;
        transition: all var(--transition); display: flex; flex-direction: column;
        align-items: center; gap: 8px; margin-bottom: 16px;
      }
      .dropzone:hover { border-color: var(--c-accent); background: var(--c-accent-light); }
      .dropzone__icon { font-size: 32px; }
      .dropzone__text { font-size: 15px; font-weight: 600; color: var(--c-text-primary); }
      .dropzone__sub { font-size: 12px; color: var(--c-text-muted); }
      .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; margin-bottom: 16px; }
      .photo-item { position: relative; aspect-ratio: 4/3; border-radius: 8px; overflow: hidden; background: var(--c-bg); }
      .photo-img { width: 100%; height: 100%; object-fit: cover; }
      .photo-cover { position: absolute; top: 6px; left: 6px; background: var(--c-accent); color: #fff; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 3px; }
      .photo-remove {
        position: absolute; top: 6px; right: 6px;
        background: rgba(0,0,0,0.55); color: #fff; border: none;
        width: 24px; height: 24px; border-radius: 50%; font-size: 12px;
        cursor: pointer; display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity var(--transition);
      }
      .photo-item:hover .photo-remove { opacity: 1; }
      .progress { background: var(--c-bg); border-radius: 4px; overflow: hidden; height: 6px; margin-bottom: 8px; position: relative; }
      .progress__bar { height: 100%; background: var(--c-accent); transition: width 0.3s ease; border-radius: 4px; }
      .progress__label { font-size: 12px; color: var(--c-text-secondary); display: block; text-align: center; margin-top: 6px; }
      .btn-submit {
        width: 100%; height: 48px; background: var(--c-accent); color: #fff;
        border: none; border-radius: var(--radius-sm); font-size: 15px;
        font-weight: 700; cursor: pointer; transition: background var(--transition);
        margin-top: 8px;
      }
      .btn-submit:hover:not(:disabled) { background: var(--c-accent-hover); }
      .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      .btn-submit--flex { flex: 1; }
      .btn-secondary {
        height: 48px; padding: 0 24px; border: 1px solid var(--c-border);
        background: var(--c-bg); color: var(--c-text-secondary); border-radius: var(--radius-sm);
        font-size: 14px; font-weight: 500; cursor: pointer; transition: all var(--transition);
      }
      .btn-secondary:hover { border-color: var(--c-border-dark); color: var(--c-text-primary); }
      .form-actions { display: flex; gap: 12px; margin-top: 8px; }
    `}</style>
  );
}
