// app/rejestracja/page.tsx
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zarejestruj się" };

export default function RejestracjaPage() {
  return (
    <div className="auth-page">
      <SignUp />
      <style jsx>{`
        .auth-page {
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }
      `}</style>
    </div>
  );
}
