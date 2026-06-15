// types/index.ts
import type { Listing, ListingImage, Make, Model, User } from "@prisma/client";

// ─────────────────────────────────────────
// OGŁOSZENIA
// ─────────────────────────────────────────

/** Ogłoszenie z miniaturką i podstawowymi relacjami — do kart na liście */
export type ListingCard = Pick<
  Listing,
  | "id"
  | "slug"
  | "title"
  | "price"
  | "year"
  | "mileage"
  | "fuelType"
  | "transmission"
  | "city"
  | "voivodeship"
  | "isFeatured"
  | "createdAt"
> & {
  make: Pick<Make, "name" | "slug">;
  model: Pick<Model, "name" | "slug">;
  coverImage: Pick<ListingImage, "url"> | null;
};

/** Pełne ogłoszenie — do strony szczegółowej */
export type ListingFull = Listing & {
  make: Make;
  model: Model;
  images: ListingImage[];
  user: Pick<User, "id" | "name" | "phone" | "avatarUrl" | "isDealer" | "createdAt">;
};

/** Filtry wyszukiwania ogłoszeń */
export type ListingFilters = {
  makeId?: number;
  modelId?: number;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number; // w złotych (UI) — konwertujemy na grosze przed query
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  fuelType?: string;
  transmission?: string;
  voivodeship?: string;
  bodyType?: string;
  query?: string; // full-text search
  page?: number;
  perPage?: number;
  sort?: ListingSort;
};

export type ListingSort =
  | "newest"      // domyślnie
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "mileage_asc"
  | "year_desc";

/** Wynik paginowanego zapytania */
export type PaginatedListings = {
  listings: ListingCard[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

// ─────────────────────────────────────────
// FORMULARZE
// ─────────────────────────────────────────

/** Dane do stworzenia/edycji ogłoszenia */
export type ListingFormData = {
  makeId: number;
  modelId: number;
  year: number;
  mileage: number;
  price: number; // w złotych (UI)
  fuelType: string;
  transmission: string;
  engineCc?: number;
  powerHp?: number;
  color?: string;
  doors?: number;
  seats?: number;
  vin?: string;
  description: string;
  city: string;
  voivodeship: string;
};

// ─────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  code?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─────────────────────────────────────────
// HELPER TYPES
// ─────────────────────────────────────────

export type MakeWithModels = Make & {
  models: Model[];
};
