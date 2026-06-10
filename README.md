# Automarket 🚗

Alternatywa dla OtoMoto — serwis ogłoszeń samochodowych zbudowany na Next.js 14, PostgreSQL i Prisma.

## Stack

| Warstwa | Technologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Język | TypeScript |
| Baza danych | PostgreSQL + Prisma ORM |
| Autentykacja | Clerk |
| Zdjęcia | Cloudinary |
| Stylowanie | Tailwind CSS |
| Hosting | Vercel + Supabase/Neon |

---

## Szybki start

### 1. Utwórz projekt Next.js

```bash
npx create-next-app@latest automarket \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd automarket
```

### 2. Zainstaluj zależności

```bash
# ORM i baza
npm install prisma @prisma/client

# Autentykacja
npm install @clerk/nextjs

# Upload zdjęć
npm install cloudinary next-cloudinary

# Utilities
npm install slugify
npm install -D @types/node
```

### 3. Skonfiguruj zmienne środowiskowe

```bash
cp .env.example .env.local
# Uzupełnij wartości w .env.local
```

### 4. Skonfiguruj Prisma

```bash
# Skopiuj schema.prisma do prisma/schema.prisma
mkdir prisma
cp schema.prisma prisma/schema.prisma

# Utwórz bazę i uruchom migrację
npx prisma migrate dev --name init

# Uruchom migration.sql (triggery i seed)
psql $DATABASE_URL -f migration.sql
```

### 5. Uruchom projekt

```bash
npm run dev
# → http://localhost:3000
```

---

## Struktura projektu

```
src/
├── app/
│   ├── (auth)/
│   │   ├── logowanie/         # Clerk sign-in
│   │   └── rejestracja/       # Clerk sign-up
│   ├── ogloszenia/
│   │   ├── page.tsx           # Lista ogłoszeń + filtry
│   │   ├── [slug]/
│   │   │   └── page.tsx       # Strona ogłoszenia
│   │   └── nowe/
│   │       └── page.tsx       # Formularz dodawania
│   ├── profil/
│   │   └── page.tsx           # Panel użytkownika
│   ├── layout.tsx
│   └── page.tsx               # Strona główna
├── components/
│   ├── listings/
│   │   ├── ListingCard.tsx    # Karta ogłoszenia
│   │   ├── ListingGrid.tsx    # Siatka ogłoszeń
│   │   ├── ListingFilters.tsx # Panel filtrów
│   │   └── ListingForm.tsx    # Formularz
│   ├── ui/                    # Komponenty bazowe
│   └── layout/                # Header, Footer
├── lib/
│   ├── prisma.ts              # Klient Prisma (singleton)
│   ├── cloudinary.ts          # Upload helper
│   └── utils.ts               # Helpers (slugify, formatPrice...)
└── types/
    └── index.ts               # Typy TypeScript
```

---

## Przydatne komendy Prisma

```bash
# Podgląd bazy w przeglądarce
npx prisma studio

# Po zmianie schema.prisma
npx prisma migrate dev --name nazwa_zmiany

# Regeneruj klienta (po każdej migracji)
npx prisma generate

# Resetuj bazę (UWAGA: usuwa dane!)
npx prisma migrate reset
```

---

## Roadmapa

- [x] Schemat bazy danych
- [ ] Setup projektu Next.js
- [ ] Autentykacja (Clerk)
- [ ] Lista ogłoszeń + filtry
- [ ] Strona ogłoszenia
- [ ] Formularz dodawania ogłoszenia
- [ ] Panel użytkownika
- [ ] Full-text search
- [ ] Wiadomości
- [ ] Promowanie ogłoszeń (Stripe)
- [ ] Panel admina
