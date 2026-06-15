// components/listings/FavouriteButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = { listingId: string };

export function FavouriteButton({ listingId }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch(`/api/favourites/${listingId}`)
      .then((r) => r.json())
      .then((d) => setIsFav(d.data?.isFav ?? false))
      .catch(() => {});
  }, [listingId, isSignedIn]);

  async function toggle() {
    if (!isSignedIn) { router.push("/logowanie"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/favourites", {
        method: isFav ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) setIsFav((v) => !v);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={`fav-btn ${isFav ? "fav-btn--active" : ""}`}
      onClick={toggle}
      disabled={loading}
      aria-label={isFav ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
      aria-pressed={isFav}
    >
      {isFav ? "♥" : "♡"}
      
    </button>
  );
}
