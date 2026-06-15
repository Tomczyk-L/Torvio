// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ success: false, error: "Nie jesteś zalogowany" }, { status: 401 });
    }

    const { listingId, receiverId, body } = await req.json();
    if (!listingId || !receiverId || !body?.trim()) {
      return NextResponse.json({ success: false, error: "Brakuje wymaganych pól" }, { status: 400 });
    }

    const sender = await prisma.user.findUnique({ where: { clerkId } });
    if (!sender) {
      return NextResponse.json({ success: false, error: "Użytkownik nie istnieje" }, { status: 404 });
    }

    if (sender.id === receiverId) {
      return NextResponse.json({ success: false, error: "Nie możesz pisać do siebie" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        listingId,
        senderId: sender.id,
        receiverId,
        body: body.trim().slice(0, 1000),
      },
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/messages]", err);
    return NextResponse.json({ success: false, error: "Błąd serwera" }, { status: 500 });
  }
}
