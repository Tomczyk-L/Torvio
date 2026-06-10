// lib/utils.ts

// ─────────────────────────────────────────
// CENY
// ─────────────────────────────────────────

/** Zamienia grosze na czytelną kwotę: 9990000 → "99 900 zł" */
export function formatPrice(grosz: number): string {
  const zloty = grosz / 100;
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(zloty);
}

/** Zamienia złote na grosze: 99900 → 9990000 */
export function toGrosze(zloty: number): number {
  return Math.round(zloty * 100);
}

/** Zamienia grosze na złote: 9990000 → 99900 */
export function toZloty(grosz: number): number {
  return grosz / 100;
}

// ─────────────────────────────────────────
// PRZEBIEG
// ─────────────────────────────────────────

/** Formatuje przebieg: 123456 → "123 456 km" */
export function formatMileage(km: number): string {
  return new Intl.NumberFormat("pl-PL").format(km) + " km";
}

// ─────────────────────────────────────────
// SLUG
// ─────────────────────────────────────────

const POLISH_MAP: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n",
  ó: "o", ś: "s", ź: "z", ż: "z",
  Ą: "A", Ć: "C", Ę: "E", Ł: "L", Ń: "N",
  Ó: "O", Ś: "S", Ź: "Z", Ż: "Z",
};

function removeDiacritics(str: string): string {
  return str
    .split("")
    .map((c) => POLISH_MAP[c] ?? c)
    .join("");
}

/** Generuje slug z tekstu: "Volkswagen Golf TDI 2019" → "volkswagen-golf-tdi-2019" */
export function slugify(text: string): string {
  return removeDiacritics(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Generuje unikalny slug ogłoszenia z losowym suffixem */
export function generateListingSlug(
  make: string,
  model: string,
  year: number,
  city: string
): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slugify(make)}-${slugify(model)}-${year}-${slugify(city)}-${suffix}`;
}

/** Generuje tytuł ogłoszenia: "Volkswagen Golf 2.0 TDI 2019" */
export function generateListingTitle(
  make: string,
  model: string,
  engineCc?: number | null,
  fuelType?: string,
  year?: number
): string {
  const parts = [make, model];
  if (engineCc) parts.push(`${(engineCc / 1000).toFixed(1)}`);
  if (fuelType) parts.push(fuelTypeLabel(fuelType));
  if (year) parts.push(String(year));
  return parts.join(" ");
}

// ─────────────────────────────────────────
// ETYKIETY
// ─────────────────────────────────────────

export function fuelTypeLabel(fuel: string): string {
  const map: Record<string, string> = {
    PETROL: "Benzyna",
    DIESEL: "Diesel",
    ELECTRIC: "Elektryczny",
    HYBRID: "Hybryda",
    LPG: "LPG",
    CNG: "CNG",
  };
  return map[fuel] ?? fuel;
}

export function transmissionLabel(transmission: string): string {
  return transmission === "MANUAL" ? "Manualna" : "Automatyczna";
}

export function bodyTypeLabel(bodyType: string): string {
  const map: Record<string, string> = {
    sedan: "Sedan",
    hatchback: "Hatchback",
    kombi: "Kombi",
    suv: "SUV",
    coupe: "Coupe",
    cabrio: "Kabriolet",
    van: "Van",
    pickup: "Pickup",
  };
  return map[bodyType] ?? bodyType;
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DRAFT: "Szkic",
    ACTIVE: "Aktywne",
    SOLD: "Sprzedane",
    EXPIRED: "Wygasłe",
  };
  return map[status] ?? status;
}

export function voivodeshipLabel(slug: string): string {
  const map: Record<string, string> = {
    dolnoslaskie: "Dolnośląskie",
    "kujawsko-pomorskie": "Kujawsko-pomorskie",
    lubelskie: "Lubelskie",
    lubuskie: "Lubuskie",
    lodzkie: "Łódzkie",
    malopolskie: "Małopolskie",
    mazowieckie: "Mazowieckie",
    opolskie: "Opolskie",
    podkarpackie: "Podkarpackie",
    podlaskie: "Podlaskie",
    pomorskie: "Pomorskie",
    slaskie: "Śląskie",
    "swietokrzyskie": "Świętokrzyskie",
    "warminsko-mazurskie": "Warmińsko-mazurskie",
    wielkopolskie: "Wielkopolskie",
    zachodniopomorskie: "Zachodniopomorskie",
  };
  return map[slug] ?? slug;
}

export const VOIVODESHIPS = [
  { value: "dolnoslaskie",         label: "Dolnośląskie" },
  { value: "kujawsko-pomorskie",   label: "Kujawsko-pomorskie" },
  { value: "lubelskie",            label: "Lubelskie" },
  { value: "lubuskie",             label: "Lubuskie" },
  { value: "lodzkie",              label: "Łódzkie" },
  { value: "malopolskie",          label: "Małopolskie" },
  { value: "mazowieckie",          label: "Mazowieckie" },
  { value: "opolskie",             label: "Opolskie" },
  { value: "podkarpackie",         label: "Podkarpackie" },
  { value: "podlaskie",            label: "Podlaskie" },
  { value: "pomorskie",            label: "Pomorskie" },
  { value: "slaskie",              label: "Śląskie" },
  { value: "swietokrzyskie",       label: "Świętokrzyskie" },
  { value: "warminsko-mazurskie",  label: "Warmińsko-mazurskie" },
  { value: "wielkopolskie",        label: "Wielkopolskie" },
  { value: "zachodniopomorskie",   label: "Zachodniopomorskie" },
];

// ─────────────────────────────────────────
// DATY
// ─────────────────────────────────────────

/** "3 godziny temu", "wczoraj", "12 mar 2024" */
export function timeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "przed chwilą";
  if (minutes < 60) return `${minutes} min temu`;
  if (hours < 24) return `${hours} godz. temu`;
  if (days === 1) return "wczoraj";
  if (days < 7) return `${days} dni temu`;

  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// ─────────────────────────────────────────
// QUERY PARAMS
// ─────────────────────────────────────────

/** Czyści obiekt z undefined/null/empty — do budowania URL search params */
export function cleanParams(
  obj: Record<string, string | number | undefined | null>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, String(v)])
  );
}

// ─────────────────────────────────────────
// WALIDACJA
// ─────────────────────────────────────────

export function isValidYear(year: number): boolean {
  return year >= 1900 && year <= new Date().getFullYear() + 1;
}

export function isValidPrice(grosz: number): boolean {
  return grosz > 0 && grosz <= 100_000_000_00; // max 100 mln zł
}

export function isValidMileage(km: number): boolean {
  return km >= 0 && km <= 2_000_000;
}
