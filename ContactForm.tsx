// components/listings/ContactForm.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

type Props = {
  listingId: string;
  receiverId: string;
  sellerPhone?: string | null;
};

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm({ listingId, receiverId, sellerPhone }: Props) {
  const { isSignedIn } = useUser();
  const [message, setMessage] = useState(
    "Dzień dobry, jestem zainteresowany/a tym ogłoszeniem. Czy auto jest jeszcze dostępne?"
  );
  const [state, setState] = useState<State>("idle");
  const [showPhone, setShowPhone] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, receiverId, body: message }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (!isSignedIn) {
    return (
      <div className="unauth">
        <p className="unauth__text">Zaloguj się, żeby skontaktować się ze sprzedającym.</p>
        <a href="/logowanie" className="btn-full">Zaloguj się</a>
        {sellerPhone && (
          <div className="phone-reveal">
            <button className="btn-phone" onClick={() => setShowPhone(true)}>
              {showPhone ? `📞 ${sellerPhone}` : "Pokaż numer telefonu"}
            </button>
          </div>
        )}
        <style jsx>{`
          .unauth { display: flex; flex-direction: column; gap: 10px; }
          .unauth__text { font-size: 13px; color: var(--c-text-secondary); margin: 0; }
          .btn-full {
            display: block;
            text-align: center;
            padding: 10px;
            background: var(--c-accent);
            color: #fff;
            border-radius: var(--radius-sm);
            font-size: 14px;
            font-weight: 600;
          }
          .phone-reveal { margin-top: 4px; }
          .btn-phone {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--c-border);
            background: var(--c-bg);
            border-radius: var(--radius-sm);
            font-size: 14px;
            cursor: pointer;
            color: var(--c-text-primary);
            font-weight: 500;
          }
          .btn-phone:hover { border-color: var(--c-border-dark); }
        `}</style>
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div className="sent" role="status">
        <div className="sent__icon" aria-hidden="true">✅</div>
        <p className="sent__text">Wiadomość wysłana! Sprzedający odpowie wkrótce.</p>
        <button className="btn-again" onClick={() => setState("idle")}>Wyślij kolejną</button>
        <style jsx>{`
          .sent { text-align: center; padding: 16px 0; }
          .sent__icon { font-size: 32px; margin-bottom: 12px; }
          .sent__text { font-size: 14px; color: var(--c-text-secondary); margin: 0 0 12px; }
          .btn-again {
            font-size: 13px;
            color: var(--c-accent);
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
          }
          .btn-again:hover { text-decoration: underline; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="form">
      <textarea
        className="form__textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        maxLength={1000}
        aria-label="Wiadomość do sprzedającego"
        disabled={state === "sending"}
      />
      <div className="form__chars">{message.length}/1000</div>

      {state === "error" && (
        <p className="form__error" role="alert">Błąd wysyłania. Spróbuj ponownie.</p>
      )}

      <button
        className="form__submit"
        onClick={handleSend}
        disabled={state === "sending" || !message.trim()}
        aria-busy={state === "sending"}
      >
        {state === "sending" ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>

      {sellerPhone && (
        <button
          className="form__phone"
          onClick={() => setShowPhone((v) => !v)}
          aria-expanded={showPhone}
        >
          {showPhone ? `📞 ${sellerPhone}` : "Pokaż numer telefonu"}
        </button>
      )}

      <style jsx>{`
        .form { display: flex; flex-direction: column; gap: 8px; }
        .form__textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--c-border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-family: var(--font-sans);
          color: var(--c-text-primary);
          background: var(--c-bg);
          resize: vertical;
          line-height: 1.6;
          transition: border-color var(--transition);
        }
        .form__textarea:focus { border-color: var(--c-accent); outline: none; }
        .form__chars { font-size: 11px; color: var(--c-text-muted); text-align: right; }
        .form__error { font-size: 12px; color: var(--c-danger); margin: 0; }
        .form__submit {
          width: 100%;
          height: 44px;
          background: var(--c-accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition);
        }
        .form__submit:hover:not(:disabled) { background: var(--c-accent-hover); }
        .form__submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .form__phone {
          width: 100%;
          height: 40px;
          border: 1px solid var(--c-border);
          background: var(--c-bg);
          border-radius: var(--radius-sm);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: var(--c-text-primary);
          transition: all var(--transition);
        }
        .form__phone:hover { border-color: var(--c-border-dark); }
      `}</style>
    </div>
  );
}
