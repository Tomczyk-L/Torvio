export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

// app/api/listings/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";


import { uploadListingImage } from "@/lib/cloudinary";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { success: false, error: "Nie jesteś zalogowany" },
        { status: 401 }
      );
    }

    // Sprawdź czy ogłoszenie należy do tego użytkownika
    const user = await prisma.user.findUnique({ where: { clerkId } });
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" } } },
    });

    if (!listing || !user || listing.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: "Brak dostępu" },
        { status: 403 }
      );
    }

    if (listing.images.length >= 20) {
      return NextResponse.json(
        { success: false, error: "Maksymalnie 20 zdjęć na ogłoszenie" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Brak pliku" },
        { status: 400 }
      );
    }

    // Walidacja rozmiaru (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Zdjęcie nie może przekraczać 10MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const position = listing.images.length;
    const isCover = position === 0;

    const { url } = await uploadListingImage(buffer, listing.id, position);

    const image = await prisma.listingImage.create({
      data: {
        listingId: listing.id,
        url,
        position,
        isCover,
      },
    });

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/listings/:id/images]", err);
    return NextResponse.json(
      { success: false, error: "Błąd uploadu" },
      { status: 500 }
    );
  }
}

/** Usuń zdjęcie */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ success: false, error: "Nie jesteś zalogowany" }, { status: 401 });
    }

    const { imageId } = await req.json();
    const user = await prisma.user.findUnique({ where: { clerkId } });
    const image = await prisma.listingImage.findUnique({
      where: { id: imageId },
      include: { listing: true },
    });

    if (!image || !user || image.listing.userId !== user.id) {
      return NextResponse.json({ success: false, error: "Brak dostępu" }, { status: 403 });
    }

    await prisma.listingImage.delete({ where: { id: imageId } });

    // Jeśli to było zdjęcie główne, ustaw kolejne jako główne
    if (image.isCover) {
      await prisma.listingImage.updateMany({
        where: { listingId: params.id, position: { gt: image.position } },
        data: { position: { decrement: 1 } },
      });
      const next = await prisma.listingImage.findFirst({
        where: { listingId: params.id },
        orderBy: { position: "asc" },
      });
      if (next) {
        await prisma.listingImage.update({
          where: { id: next.id },
          data: { isCover: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/listings/:id/images]", err);
    return NextResponse.json({ success: false, error: "Błąd serwera" }, { status: 500 });
  }
}
