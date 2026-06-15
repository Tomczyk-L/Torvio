export const dynamic = 'force-dynamic';

// app/logowanie/page.tsx
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zaloguj się" };

export default function LogowaniePage() {
  return (
    <div className="auth-page">
      <SignIn />
      
    </div>
  );
}
