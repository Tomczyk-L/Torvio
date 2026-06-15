export const dynamic = 'force-dynamic';

// app/profil/wiadomosci/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { timeAgo } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Wiadomości" };

export default async function WiadomosciPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/logowanie");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) redirect("/logowanie");

  // Pobierz unikalne wątki (grupowane po ogłoszeniu + rozmówcy)
  const messages = await prisma.message.findMany({
    where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, slug: true, images: { where: { isCover: true }, take: 1 } } },
      sender:   { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });

  // Deduplikacja — jeden wątek per listing+rozmówca
  const seen = new Set<string>();
  const threads = messages.filter((m) => {
    const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
    const key = `${m.listingId}-${otherId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const unreadCount = messages.filter((m) => m.receiverId === user.id && !m.readAt).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Wiadomości</h1>
        {unreadCount > 0 && (
          <span className="unread-badge" aria-label={`${unreadCount} nieprzeczytanych`}>
            {unreadCount}
          </span>
        )}
      </div>

      {threads.length === 0 ? (
        <div className="empty">
          <div className="empty__icon" aria-hidden="true">✉️</div>
          <h2 className="empty__title">Brak wiadomości</h2>
          <p className="empty__sub">Wiadomości od kupujących i sprzedających pojawią się tutaj.</p>
        </div>
      ) : (
        <div className="threads" role="list" aria-label="Wątki wiadomości">
          {threads.map((m) => {
            const other = m.senderId === user.id ? m.receiver : m.sender;
            const isUnread = m.receiverId === user.id && !m.readAt;
            return (
              <a
                key={m.id}
                href={`/ogloszenia/${m.listing.slug}`}
                className={`thread ${isUnread ? "thread--unread" : ""}`}
                role="listitem"
              >
                <div className="thread__avatar" aria-hidden="true">
                  {other.name.charAt(0).toUpperCase()}
                </div>
                <div className="thread__body">
                  <div className="thread__top">
                    <span className="thread__name">{other.name}</span>
                    <time className="thread__time" dateTime={new Date(m.createdAt).toISOString()}>
                      {timeAgo(new Date(m.createdAt))}
                    </time>
                  </div>
                  <p className="thread__listing">{m.listing.title}</p>
                  <p className="thread__preview">
                    {m.senderId === user.id ? "Ty: " : ""}{m.body.slice(0, 80)}
                    {m.body.length > 80 ? "…" : ""}
                  </p>
                </div>
                {isUnread && <span className="thread__dot" aria-hidden="true" />}
              </a>
            );
          })}
        </div>
      )}

      
    </div>
  );
}
