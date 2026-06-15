export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  try {
    const { auth } = await import("@clerk/nextjs/server");
    const { prisma } = await import("@/lib/prisma");
    
    const { userId: clerkId } = await auth();
    if (!clerkId) return NextResponse.json({ success: true, data: { isFav: false } });

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return NextResponse.json({ success: true, data: { isFav: false } });

    const fav = await prisma.favourite.findUnique({
      where: { userId_listingId: { userId: user.id, listingId: params.listingId } },
    });

    return NextResponse.json({ success: true, data: { isFav: !!fav } });
  } catch {
    return NextResponse.json({ success: true, data: { isFav: false } });
  }
}