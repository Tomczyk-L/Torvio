// app/profil/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProfileNav } from "@/components/profile/ProfileNav";

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) redirect("/logowanie");

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true,
      _count: { select: { listings: true, favourites: true } } },
  });

  if (!user) redirect("/logowanie");

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">

          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-user">
              <div className="profile-avatar" aria-hidden="true">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="profile-name">{user.name}</p>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat__num">{user._count.listings}</span>
                <span className="profile-stat__label">ogłoszeń</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__num">{user._count.favourites}</span>
                <span className="profile-stat__label">ulubionych</span>
              </div>
            </div>

            <ProfileNav />
          </aside>

          {/* Treść zakładki */}
          <main className="profile-main">{children}</main>
        </div>
      </div>

      <style jsx>{`
        .profile-page { padding: 32px 0 64px; }
        .profile-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 28px;
          align-items: start;
        }
        .profile-sidebar {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          padding: 20px;
          position: sticky;
          top: 80px;
        }
        .profile-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
          margin-bottom: 16px;
        }
        .profile-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--c-accent-light);
          color: var(--c-accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; font-weight: 800;
          flex-shrink: 0;
        }
        .profile-name { font-size: 14px; font-weight: 700; margin: 0 0 2px; }
        .profile-email { font-size: 12px; color: var(--c-text-muted); margin: 0; }
        .profile-stats {
          display: flex;
          gap: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--c-border);
          margin-bottom: 8px;
        }
        .profile-stat { display: flex; flex-direction: column; }
        .profile-stat__num { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .profile-stat__label { font-size: 11px; color: var(--c-text-muted); }
        .profile-main { min-width: 0; }
        @media (max-width: 768px) {
          .profile-layout { grid-template-columns: 1fr; }
          .profile-sidebar { position: static; }
        }
      `}</style>
    </div>
  );
}
