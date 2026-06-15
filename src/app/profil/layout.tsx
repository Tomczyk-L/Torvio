export const dynamic = 'force-dynamic';

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

      
    </div>
  );
}
