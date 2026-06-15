export const dynamic = 'force-dynamic';

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

      
    </div>
  );
}
