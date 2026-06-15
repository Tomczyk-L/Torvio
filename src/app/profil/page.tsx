// app/profil/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUserListings } from "@/lib/listings";
import { MyListingsTable } from "@/components/profile/MyListingsTable";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Moje ogłoszenia" };

export default async function ProfilPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/logowanie");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/logowanie");

  const listings = await getUserListings(user.id);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Moje ogłoszenia</h1>
        <Link href="/ogloszenia/nowe" className="btn-add">
          + Dodaj nowe
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="empty">
          <div className="empty__icon" aria-hidden="true">🚗</div>
          <h2 className="empty__title">Nie masz jeszcze żadnych ogłoszeń</h2>
          <p className="empty__sub">Sprzedaj swoje auto — dodaj pierwsze ogłoszenie za darmo.</p>
          <Link href="/ogloszenia/nowe" className="empty__btn">Dodaj ogłoszenie</Link>
        </div>
      ) : (
        <MyListingsTable listings={listings} />
      )}

      
    </div>
  );
}
