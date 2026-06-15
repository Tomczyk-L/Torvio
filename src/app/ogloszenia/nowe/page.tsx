export const dynamic = 'force-dynamic';

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
      
    </div>
  );
}
