export const dynamic = 'force-dynamic';

// app/api/listings/create/route.ts
import { NextRequest, NextResponse } from "next/server";


import { createListing } from "@/lib/listings";
import type { ListingFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    // Znajdź użytkownika w bazie po clerkId
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Użytkownik nie istnieje" },
        { status: 404 }
      );
    }

    const body: ListingFormData = await req.json();

    // Podstawowa walidacja
    if (!body.makeId || !body.modelId || !body.year || !body.price) {
      return NextResponse.json(
        { success: false, error: "Brakuje wymaganych pól" },
        { status: 400 }
      );
    }

    const result = await createListing(user.id, body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/listings/create]", err);
    return NextResponse.json(
      { success: false, error: "Błąd serwera" },
      { status: 500 }
    );
  }
}
