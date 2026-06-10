// app/ogloszenia/nowe/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { getMakesWithCount } from "@/lib/listings";
import { NewListingForm } from "@/components/listings/NewListingForm";

export const metadata: Metadata = { title: "Dodaj ogłoszenie" };

export default async function NewListingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/logowanie?redirect=/ogloszenia/nowe");

  const makes = await getMakesWithCount();
  return (
    <div className="page">
      <div className="container">
        <div className="page__inner">
          <header className="page__header">
            <h1 className="page__title">Dodaj ogłoszenie</h1>
            <p className="page__subtitle">Uzupełnij dane pojazdu i dodaj zdjęcia. Ogłoszenie będzie aktywne przez 30 dni.</p>
          </header>
          <NewListingForm makes={makes} />
        </div>
      </div>
      <style jsx>{`
        .page { padding: 32px 0 64px; }
        .page__inner { max-width: 720px; margin: 0 auto; }
        .page__header { margin-bottom: 32px; }
        .page__title { font-size: 26px; font-weight: 800; letter-spacing: -0.6px; margin: 0 0 8px; }
        .page__subtitle { font-size: 14px; color: var(--c-text-secondary); margin: 0; }
      `}</style>
    </div>
  );
}
