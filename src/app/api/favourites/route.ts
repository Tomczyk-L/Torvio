export const dynamic = 'force-dynamic';

// app/api/favourites/route.ts
import { NextRequest, NextResponse } from "next/server";



async function getUser(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ success: false, error: "Brak autoryzacji" }, { status: 401 });

  const { listingId } = await req.json();
  const user = await getUser(clerkId);
  if (!user) return NextResponse.json({ success: false, error: "Brak użytkownika" }, { status: 404 });

  await prisma.favourite.upsert({
    where:  { userId_listingId: { userId: user.id, listingId } },
    create: { userId: user.id, listingId },
    update: {},
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ success: false, error: "Brak autoryzacji" }, { status: 401 });

  const { listingId } = await req.json();
  const user = await getUser(clerkId);
  if (!user) return NextResponse.json({ success: false, error: "Brak użytkownika" }, { status: 404 });

  await prisma.favourite.deleteMany({
    where: { userId: user.id, listingId },
  });

  return NextResponse.json({ success: true });
}
