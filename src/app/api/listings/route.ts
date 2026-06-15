export const dynamic = 'force-dynamic';

// app/api/listings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/listings";
import type { ListingFilters, ListingSort } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const p = req.nextUrl.searchParams;

    const filters: ListingFilters = {
      makeId:       p.get("makeId")       ? Number(p.get("makeId"))       : undefined,
      modelId:      p.get("modelId")      ? Number(p.get("modelId"))      : undefined,
      yearFrom:     p.get("yearFrom")     ? Number(p.get("yearFrom"))     : undefined,
      yearTo:       p.get("yearTo")       ? Number(p.get("yearTo"))       : undefined,
      priceFrom:    p.get("priceFrom")    ? Number(p.get("priceFrom"))    : undefined,
      priceTo:      p.get("priceTo")      ? Number(p.get("priceTo"))      : undefined,
      mileageFrom:  p.get("mileageFrom")  ? Number(p.get("mileageFrom"))  : undefined,
      mileageTo:    p.get("mileageTo")    ? Number(p.get("mileageTo"))    : undefined,
      fuelType:     p.get("fuelType")     ?? undefined,
      transmission: p.get("transmission") ?? undefined,
      voivodeship:  p.get("voivodeship")  ?? undefined,
      query:        p.get("q")            ?? undefined,
      page:         p.get("page")         ? Number(p.get("page"))         : 1,
      perPage:      p.get("perPage")      ? Number(p.get("perPage"))      : 24,
      sort:         (p.get("sort") as ListingSort) ?? "newest",
    };

    const result = await getListings(filters);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("[GET /api/listings]", err);
    return NextResponse.json(
      { success: false, error: "Błąd serwera" },
      { status: 500 }
    );
  }
}
