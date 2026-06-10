// app/profil/ulubione/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/listings/ListingCard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Obserwowane ogłoszenia" };

export default async function UlubiOnePage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/logowanie");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/logowanie");

  const favourites = await prisma.favourite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          make:   { select: { name: true, slug: true } },
          model:  { select: { name: true, slug: true } },
          images: { where: { isCover: true }, take: 1, select: { url: true } },
        },
      },
    },
  });

  const listings = favourites
    .filter((f) => f.listing.status === "ACTIVE")
    .map((f) => ({ ...f.listing, coverImage: f.listing.images[0] ?? null }));

  return (
    <div>
      <h1 className="page-title">Obserwowane ogłoszenia</h1>

      {listings.length === 0 ? (
        <div className="empty">
          <div className="empty__icon" aria-hidden="true">♡</div>
          <h2 className="empty__title">Brak obserwowanych ogłoszeń</h2>
          <p className="empty__sub">Kliknij ♡ na dowolnym ogłoszeniu, żeby je obserwować.</p>
          <a href="/ogloszenia" className="empty__btn">Przeglądaj ogłoszenia</a>
        </div>
      ) : (
        <>
          <p className="count">{listings.length} ogłoszeń</p>
          <div className="grid" role="list">
            {listings.map((l) => (
              <div key={l.id} role="listitem">
                <ListingCard listing={l as any} />
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .page-title { font-size: 20px; font-weight: 800; letter-spacing: -0.4px; margin: 0 0 20px; }
        .count { font-size: 13px; color: var(--c-text-muted); margin: 0 0 16px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .empty {
          text-align: center; padding: 64px 32px;
          background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg);
        }
        .empty__icon { font-size: 40px; margin-bottom: 16px; color: var(--c-text-muted); }
        .empty__title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .empty__sub { font-size: 14px; color: var(--c-text-secondary); margin: 0 0 24px; }
        .empty__btn {
          display: inline-block; padding: 10px 24px;
          background: var(--c-accent); color: #fff;
          border-radius: var(--radius-sm); font-size: 14px; font-weight: 600;
        }
      `}</style>
    </div>
  );
}
