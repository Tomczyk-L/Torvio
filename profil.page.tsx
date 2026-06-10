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

      <style jsx>{`
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .page-title { font-size: 20px; font-weight: 800; letter-spacing: -0.4px; margin: 0; }
        .btn-add {
          padding: 8px 16px;
          background: var(--c-accent);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 600;
        }
        .empty {
          text-align: center;
          padding: 64px 32px;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
        }
        .empty__icon { font-size: 40px; margin-bottom: 16px; }
        .empty__title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .empty__sub { font-size: 14px; color: var(--c-text-secondary); margin: 0 0 24px; }
        .empty__btn {
          display: inline-block;
          padding: 10px 24px;
          background: var(--c-accent);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
