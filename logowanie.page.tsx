// app/logowanie/page.tsx
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Zaloguj się" };

export default function LogowaniePage() {
  return (
    <div className="auth-page">
      <SignIn />
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
