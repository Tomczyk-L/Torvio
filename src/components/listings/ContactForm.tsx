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
        
      </div>
    );
  }

  if (state === "sent") {
    return (
      <div className="sent" role="status">
        <div className="sent__icon" aria-hidden="true">✅</div>
        <p className="sent__text">Wiadomość wysłana! Sprzedający odpowie wkrótce.</p>
        <button className="btn-again" onClick={() => setState("idle")}>Wyślij kolejną</button>
        
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

      
    </div>
  );
}
