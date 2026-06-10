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

      <style jsx>{`
        .page-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .page-title { font-size: 20px; font-weight: 800; letter-spacing: -0.4px; margin: 0; }
        .unread-badge {
          background: var(--c-accent); color: #fff;
          font-size: 11px; font-weight: 700;
          width: 20px; height: 20px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .threads { display: flex; flex-direction: column; gap: 0; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); overflow: hidden; }
        .thread {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--c-border);
          transition: background var(--transition);
          text-decoration: none;
          color: inherit;
        }
        .thread:last-child { border-bottom: none; }
        .thread:hover { background: var(--c-bg); }
        .thread--unread { background: var(--c-accent-light); }
        .thread--unread:hover { background: #dbeafe; }
        .thread__avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: var(--c-bg); color: var(--c-text-secondary);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 700; flex-shrink: 0;
          border: 1px solid var(--c-border);
        }
        .thread__body { flex: 1; min-width: 0; }
        .thread__top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; margin-bottom: 2px; }
        .thread__name { font-size: 14px; font-weight: 700; }
        .thread__time { font-size: 11px; color: var(--c-text-muted); flex-shrink: 0; }
        .thread__listing { font-size: 12px; color: var(--c-accent); margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .thread__preview { font-size: 13px; color: var(--c-text-secondary); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .thread__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--c-accent); flex-shrink: 0; }
        .empty { text-align: center; padding: 64px 32px; background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--radius-lg); }
        .empty__icon { font-size: 40px; margin-bottom: 16px; }
        .empty__title { font-size: 18px; font-weight: 700; margin: 0 0 8px; }
        .empty__sub { font-size: 14px; color: var(--c-text-secondary); margin: 0; }
      `}</style>
    </div>
  );
}
