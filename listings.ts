// lib/listings.ts
import { prisma } from "./prisma";
import { toGrosze } from "./utils";
import type {
  ListingCard,
  ListingFull,
  ListingFilters,
  PaginatedListings,
  ListingFormData,
} from "@/types";
import { generateListingSlug, generateListingTitle } from "./utils";

// ─────────────────────────────────────────
// POBIERANIE
// ─────────────────────────────────────────

/** Lista ogłoszeń z filtrami i paginacją */
export async function getListings(
  filters: ListingFilters = {}
): Promise<PaginatedListings> {
  const {
    makeId,
    modelId,
    yearFrom,
    yearTo,
    priceFrom,
    priceTo,
    mileageFrom,
    mileageTo,
    fuelType,
    transmission,
    voivodeship,
    query,
    page = 1,
    perPage = 24,
    sort = "newest",
  } = filters;

  const where = {
    status: "ACTIVE" as const,
    ...(makeId && { makeId }),
    ...(modelId && { modelId }),
    ...(yearFrom || yearTo
      ? { year: { gte: yearFrom, lte: yearTo } }
      : {}),
    ...(priceFrom || priceTo
      ? {
          price: {
            gte: priceFrom ? toGrosze(priceFrom) : undefined,
            lte: priceTo ? toGrosze(priceTo) : undefined,
          },
        }
      : {}),
    ...(mileageFrom || mileageTo
      ? { mileage: { gte: mileageFrom, lte: mileageTo } }
      : {}),
    ...(fuelType && { fuelType: fuelType as any }),
    ...(transmission && { transmission: transmission as any }),
    ...(voivodeship && { voivodeship }),
    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" as const } },
        { description: { contains: query, mode: "insensitive" as const } },
      ],
    }),
  };

  const orderBy = {
    newest:     { createdAt: "desc" as const },
    oldest:     { createdAt: "asc" as const },
    price_asc:  { price: "asc" as const },
    price_desc: { price: "desc" as const },
    mileage_asc: { mileage: "asc" as const },
    year_desc:  { year: "desc" as const },
  }[sort];

  const [total, rows] = await Promise.all([
    prisma.listing.count({ where }),
    prisma.listing.findMany({
      where,
      orderBy: [
        { isFeatured: "desc" }, // wyróżnione zawsze na górze
        orderBy,
      ],
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        year: true,
        mileage: true,
        fuelType: true,
        transmission: true,
        city: true,
        voivodeship: true,
        isFeatured: true,
        createdAt: true,
        make: { select: { name: true, slug: true } },
        model: { select: { name: true, slug: true } },
        images: {
          where: { isCover: true },
          take: 1,
          select: { url: true },
        },
      },
    }),
  ]);

  const listings: ListingCard[] = rows.map((r) => ({
    ...r,
    coverImage: r.images[0] ?? null,
  }));

  return {
    listings,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}

/** Pojedyncze ogłoszenie po slugu */
export async function getListingBySlug(
  slug: string
): Promise<ListingFull | null> {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      make: true,
      model: true,
      images: { orderBy: { position: "asc" } },
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatarUrl: true,
          isDealer: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) return null;

  // Zwiększ licznik wyświetleń (fire-and-forget)
  prisma.listing
    .update({
      where: { id: listing.id },
      data: { viewsCount: { increment: 1 } },
    })
    .catch(() => {});

  return listing as unknown as ListingFull;
}

/** Ogłoszenia użytkownika */
export async function getUserListings(userId: string) {
  return prisma.listing.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      make: { select: { name: true } },
      model: { select: { name: true } },
      images: {
        where: { isCover: true },
        take: 1,
        select: { url: true },
      },
    },
  });
}

/** Polecane ogłoszenia (do strony głównej) */
export async function getFeaturedListings(limit = 6): Promise<ListingCard[]> {
  const rows = await prisma.listing.findMany({
    where: { status: "ACTIVE", isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      year: true,
      mileage: true,
      fuelType: true,
      transmission: true,
      city: true,
      voivodeship: true,
      isFeatured: true,
      createdAt: true,
      make: { select: { name: true, slug: true } },
      model: { select: { name: true, slug: true } },
      images: {
        where: { isCover: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  return rows.map((r) => ({ ...r, coverImage: r.images[0] ?? null }));
}

/** Podobne ogłoszenia (ta sama marka/model, zbliżona cena) */
export async function getSimilarListings(
  listing: ListingFull,
  limit = 4
): Promise<ListingCard[]> {
  const rows = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      makeId: listing.makeId,
      modelId: listing.modelId,
      id: { not: listing.id },
      price: {
        gte: Math.floor(listing.price * 0.8),
        lte: Math.floor(listing.price * 1.2),
      },
    },
    take: limit,
    select: {
      id: true,
      slug: true,
      title: true,
      price: true,
      year: true,
      mileage: true,
      fuelType: true,
      transmission: true,
      city: true,
      voivodeship: true,
      isFeatured: true,
      createdAt: true,
      make: { select: { name: true, slug: true } },
      model: { select: { name: true, slug: true } },
      images: {
        where: { isCover: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  return rows.map((r) => ({ ...r, coverImage: r.images[0] ?? null }));
}

// ─────────────────────────────────────────
// TWORZENIE / EDYCJA
// ─────────────────────────────────────────

/** Tworzy nowe ogłoszenie (bez zdjęć — dodawane osobno) */
export async function createListing(
  userId: string,
  data: ListingFormData
): Promise<{ id: string; slug: string }> {
  const make = await prisma.make.findUnique({ where: { id: data.makeId } });
  const model = await prisma.model.findUnique({ where: { id: data.modelId } });

  if (!make || !model) throw new Error("Nieprawidłowa marka lub model");

  const title = generateListingTitle(
    make.name,
    model.name,
    data.engineCc,
    data.fuelType,
    data.year
  );
  const slug = generateListingSlug(make.name, model.name, data.year, data.city);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 dni

  const listing = await prisma.listing.create({
    data: {
      userId,
      makeId: data.makeId,
      modelId: data.modelId,
      title,
      slug,
      description: data.description,
      year: data.year,
      mileage: data.mileage,
      price: toGrosze(data.price),
      fuelType: data.fuelType as any,
      transmission: data.transmission as any,
      engineCc: data.engineCc,
      powerHp: data.powerHp,
      color: data.color,
      doors: data.doors,
      seats: data.seats,
      vin: data.vin,
      city: data.city,
      voivodeship: data.voivodeship,
      status: "DRAFT",
      expiresAt,
    },
  });

  return { id: listing.id, slug: listing.slug };
}

/** Aktywuje ogłoszenie (po dodaniu zdjęć) */
export async function activateListing(
  listingId: string,
  userId: string
): Promise<void> {
  await prisma.listing.update({
    where: { id: listingId, userId }, // userId jako zabezpieczenie
    data: { status: "ACTIVE" },
  });
}

/** Oznacza ogłoszenie jako sprzedane */
export async function markAsSold(
  listingId: string,
  userId: string
): Promise<void> {
  await prisma.listing.update({
    where: { id: listingId, userId },
    data: { status: "SOLD" },
  });
}

/** Usuwa ogłoszenie wraz ze zdjęciami */
export async function deleteListing(
  listingId: string,
  userId: string
): Promise<void> {
  await prisma.listing.delete({
    where: { id: listingId, userId },
  });
}

// ─────────────────────────────────────────
// KATALOG
// ─────────────────────────────────────────

/** Wszystkie marki z liczbą aktywnych ogłoszeń */
export async function getMakesWithCount() {
  return prisma.make.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { listings: { where: { status: "ACTIVE" } } },
      },
    },
  });
}

/** Modele dla danej marki */
export async function getModelsByMake(makeId: number) {
  return prisma.model.findMany({
    where: { makeId },
    orderBy: { name: "asc" },
  });
}
