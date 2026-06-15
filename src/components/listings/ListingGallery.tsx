// components/listings/ListingGallery.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import type { ListingImage } from "@prisma/client";

type Props = {
  images: Pick<ListingImage, "id" | "url" | "position">[];
  title: string;
};

export function ListingGallery({ images, title }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  // Klawiatura
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, prev, next]);

  if (images.length === 0) {
    return (
      <div className="gallery-empty" aria-label="Brak zdjęć">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <span>Brak zdjęć</span>
        
      </div>
    );
  }

  return (
    <>
      <div className="gallery">
        {/* Główne zdjęcie */}
        <div
          className="gallery__main"
          onClick={() => setLightbox(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightbox(true)}
          aria-label={`Zdjęcie ${active + 1} z ${images.length} — kliknij aby powiększyć`}
        >
          <Image
            src={images[active].url}
            alt={`${title} — zdjęcie ${active + 1}`}
            fill
            priority={active === 0}
            sizes="(max-width: 900px) 100vw, 65vw"
            className="gallery__main-img"
          />

          {/* Licznik */}
          <span className="gallery__counter" aria-live="polite">
            {active + 1} / {images.length}
          </span>

          {/* Strzałki nawigacji */}
          {images.length > 1 && (
            <>
              <button
                className="gallery__arrow gallery__arrow--prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Poprzednie zdjęcie"
              >
                ‹
              </button>
              <button
                className="gallery__arrow gallery__arrow--next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Następne zdjęcie"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Miniatury */}
        {images.length > 1 && (
          <div className="gallery__thumbs" role="tablist" aria-label="Miniatury zdjęć">
            {images.map((img, i) => (
              <button
                key={img.id}
                className={`gallery__thumb ${i === active ? "gallery__thumb--active" : ""}`}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={i === active}
                aria-label={`Zdjęcie ${i + 1}`}
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="gallery__thumb-img"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Powiększone zdjęcie"
        >
          <button
            className="lightbox__close"
            onClick={() => setLightbox(false)}
            aria-label="Zamknij"
          >
            ✕
          </button>

          <div className="lightbox__img-wrap" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[active].url}
              alt={`${title} — zdjęcie ${active + 1}`}
              fill
              sizes="100vw"
              className="lightbox__img"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                className="lightbox__arrow lightbox__arrow--prev"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Poprzednie zdjęcie"
              >
                ‹
              </button>
              <button
                className="lightbox__arrow lightbox__arrow--next"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Następne zdjęcie"
              >
                ›
              </button>
            </>
          )}

          <span className="lightbox__counter">{active + 1} / {images.length}</span>
        </div>
      )}

      
    </>
  );
}
