export const dynamic = 'force-dynamic';

// app/rejestracja/page.tsx
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zarejestruj się" };

export default function RejestracjaPage() {
  return (
    <div className="auth-page">
      <SignUp />
      
    </div>
  );
}
