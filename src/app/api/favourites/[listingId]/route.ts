export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createListing } from "@/lib/listings";
import type { ListingFormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ success: false, error: "Nie jestes zalogowany" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "Uzytkownik nie istnieje" }, { status: 404 });
    }
    const body: ListingFormData = await req.json();
    if (!body.makeId || !body.modelId || !body.year || !body.price) {
      return NextResponse.json({ success: false, error: "Brakuje wymaganych pol" }, { status: 400 });
    }
    const result = await createListing(user.id, body);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/listings/create]", err);
    return NextResponse.json({ success: false, error: "Blad serwera" }, { status: 500 });
  }
}