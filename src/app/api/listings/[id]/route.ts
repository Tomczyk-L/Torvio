export const dynamic = 'force-dynamic';

// app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";



export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ success: false }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ success: false }, { status: 404 });

  await prisma.listing.delete({ where: { id: params.id, userId: user.id } });
  return NextResponse.json({ success: true });
}
