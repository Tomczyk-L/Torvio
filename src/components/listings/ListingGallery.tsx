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
        <style jsx>{`
          .gallery-empty {
            background: var(--c-bg);
            border: 1px solid var(--c-border);
            border-radius: var(--radius-lg);
            aspect-ratio: 16/10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            color: var(--c-text-muted);
            font-size: 14px;
          }
        `}</style>
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

      <style jsx>{`
        .gallery {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .gallery__main {
          position: relative;
          aspect-ratio: 16/10;
          cursor: zoom-in;
          background: var(--c-bg);
          overflow: hidden;
        }
        .gallery__main-img { object-fit: cover; transition: transform 300ms ease; }
        .gallery__main:hover .gallery__main-img { transform: scale(1.01); }
        .gallery__counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.55);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 20px;
          backdrop-filter: blur(4px);
        }
        .gallery__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: all var(--transition);
          color: var(--c-text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .gallery__arrow:hover { background: #fff; box-shadow: var(--shadow-md); }
        .gallery__arrow--prev { left: 12px; }
        .gallery__arrow--next { right: 12px; }
        .gallery__thumbs {
          display: flex;
          gap: 4px;
          padding: 8px;
          overflow-x: auto;
          scrollbar-width: thin;
          background: var(--c-bg);
        }
        .gallery__thumb {
          position: relative;
          flex-shrink: 0;
          width: 72px;
          height: 54px;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          background: var(--c-border);
          transition: border-color var(--transition);
          padding: 0;
        }
        .gallery__thumb--active { border-color: var(--c-accent); }
        .gallery__thumb-img { object-fit: cover; }

        /* Lightbox */
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox__img-wrap {
          position: relative;
          width: min(90vw, 1200px);
          height: min(85vh, 800px);
        }
        .lightbox__img { object-fit: contain; }
        .lightbox__close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: rgba(255,255,255,0.12);
          border: none;
          color: #fff;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition);
        }
        .lightbox__close:hover { background: rgba(255,255,255,0.2); }
        .lightbox__arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.12);
          border: none;
          color: #fff;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          font-size: 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition);
        }
        .lightbox__arrow:hover { background: rgba(255,255,255,0.22); }
        .lightbox__arrow--prev { left: 20px; }
        .lightbox__arrow--next { right: 20px; }
        .lightbox__counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }
      `}</style>
    </>
  );
}
