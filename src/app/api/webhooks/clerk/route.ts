export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

// app/api/webhooks/clerk/route.ts
// Clerk wysyła webhook gdy użytkownik się rejestruje lub zmienia dane.
// Konfiguracja: Clerk Dashboard → Webhooks → dodaj endpoint /api/webhooks/clerk
// Events: user.created, user.updated, user.deleted

import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";


type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string; primary: boolean }[];
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    phone_numbers: { phone_number: string; primary: boolean }[];
  };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Brak CLERK_WEBHOOK_SECRET" }, { status: 500 });
  }

  // Weryfikacja podpisu Svix
  const svix = new Webhook(webhookSecret);
  const body = await req.text();
  let event: ClerkUserEvent;

  try {
    event = svix.verify(body, {
      "svix-id":        req.headers.get("svix-id") ?? "",
      "svix-timestamp": req.headers.get("svix-timestamp") ?? "",
      "svix-signature": req.headers.get("svix-signature") ?? "",
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Nieprawidłowy podpis" }, { status: 400 });
  }

  const { type, data } = event;
  const primaryEmail = data.email_addresses.find((e) => e.primary)?.email_address ?? "";
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Użytkownik";
  const phone = data.phone_numbers.find((p) => p.primary)?.phone_number;

  if (type === "user.created") {
    await prisma.user.create({
      data: {
        clerkId: data.id,
        email: primaryEmail,
        name,
        phone,
        avatarUrl: data.image_url,
      },
    });
  }

  if (type === "user.updated") {
    await prisma.user.update({
      where: { clerkId: data.id },
      data: {
        email: primaryEmail,
        name,
        phone,
        avatarUrl: data.image_url,
      },
    });
  }

  if (type === "user.deleted") {
    await prisma.user.delete({ where: { clerkId: data.id } }).catch(() => {});
  }

  return NextResponse.json({ received: true });
}
