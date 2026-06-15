export const dynamic = 'force-dynamic';

export const dynamic = 'force-dynamic';

// app/api/favourites/[listingId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ success: true, data: { isFav: false } });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ success: true, data: { isFav: false } });

  const fav = await prisma.favourite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId: params.listingId } },
  });

  return NextResponse.json({ success: true, data: { isFav: !!fav } });
}
