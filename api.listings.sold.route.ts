// app/api/listings/[id]/sold/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ success: false }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ success: false }, { status: 404 });

  await prisma.listing.update({
    where: { id: params.id, userId: user.id },
    data: { status: "SOLD" },
  });

  return NextResponse.json({ success: true });
}
