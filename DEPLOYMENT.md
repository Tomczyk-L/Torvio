# Wdrożenie Automarket — Vercel + Supabase

Czas: ~45–60 minut. Koszt: **0 zł** (oba serwisy mają darmowe tiery).

---

## Krok 1 — Przygotuj repozytorium GitHub

### 1.1 Utwórz projekt Next.js i dodaj kod

```bash
# Utwórz projekt
npx create-next-app@latest automarket \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"

cd automarket
```

### 1.2 Zainstaluj zależności

```bash
npm install prisma @prisma/client
npm install @clerk/nextjs svix
npm install cloudinary next-cloudinary
npm install slugify
```

### 1.3 Skopiuj pliki projektu

Skopiuj wszystkie pobrane pliki do odpowiednich lokalizacji w projekcie.
Struktura katalogów:

```
automarket/
├── middleware.ts                          ← root projektu
├── prisma/
│   └── schema.prisma                      ← schema.prisma
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx                       ← home.page.tsx
│   │   ├── ogloszenia/
│   │   │   ├── page.tsx                   ← ogloszenia.page.tsx
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx               ← listing-detail.page.tsx
│   │   │   └── nowe/
│   │   │       └── page.tsx               ← nowe.page.tsx
│   │   ├── profil/
│   │   │   ├── layout.tsx                 ← profil.layout.tsx
│   │   │   ├── page.tsx                   ← profil.page.tsx
│   │   │   ├── ulubione/
│   │   │   │   └── page.tsx               ← profil.ulubione.page.tsx
│   │   │   └── wiadomosci/
│   │   │       └── page.tsx               ← profil.wiadomosci.page.tsx
│   │   └── api/
│   │       ├── listings/
│   │       │   ├── route.ts               ← api.listings.route.ts
│   │       │   ├── create/
│   │       │   │   └── route.ts           ← api.listings.create.route.ts
│   │       │   └── [id]/
│   │       │       ├── route.ts           ← api.listings.delete.route.ts
│   │       │       ├── activate/
│   │       │       │   └── route.ts       ← api.listings.activate.route.ts
│   │       │       ├── images/
│   │       │       │   └── route.ts       ← api.listings.images.route.ts
│   │       │       └── sold/
│   │       │           └── route.ts       ← api.listings.sold.route.ts
│   │       ├── messages/
│   │       │   └── route.ts               ← api.messages.route.ts
│   │       ├── favourites/
│   │       │   ├── route.ts               ← api.favourites.route.ts
│   │       │   └── [listingId]/
│   │       │       └── route.ts           ← api.favourites.check.route.ts
│   │       └── webhooks/
│   │           └── clerk/
│   │               └── route.ts           ← api.webhooks.clerk.route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── home/
│   │   │   └── HomeSearch.tsx
│   │   ├── listings/
│   │   │   ├── ListingCard.tsx
│   │   │   ├── ListingFilters.tsx
│   │   │   ├── ListingSort.tsx
│   │   │   ├── ListingGallery.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── FavouriteButton.tsx
│   │   │   └── NewListingForm.tsx
│   │   ├── profile/
│   │   │   ├── ProfileNav.tsx
│   │   │   └── MyListingsTable.tsx
│   │   └── ui/
│   │       └── Pagination.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   ├── cloudinary.ts
│   │   └── listings.ts
│   └── types/
│       └── index.ts
```

### 1.4 Wypchnij na GitHub

```bash
git init
git add .
git commit -m "init: automarket MVP"
```

Wejdź na **github.com → New repository** → nazwa: `automarket` → utwórz.

```bash
git remote add origin https://github.com/TWÓJ_USERNAME/automarket.git
git branch -M main
git push -u origin main
```

---

## Krok 2 — Baza danych na Supabase

### 2.1 Utwórz projekt

1. Wejdź na **supabase.com** → Sign up (darmowe)
2. **New project** → podaj nazwę `automarket`, hasło bazy (zapisz!), wybierz region: **Central EU (Frankfurt)**
3. Poczekaj ~2 minuty na uruchomienie

### 2.2 Pobierz connection string

1. W panelu Supabase: **Settings → Database**
2. Sekcja **Connection string → URI**
3. Skopiuj URI — wygląda tak:
   ```
   postgresql://postgres:[HASŁO]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
4. Zastąp `[YOUR-PASSWORD]` swoim hasłem

> ⚠️ Supabase używa connection pooler — dla Prisma użyj portu **6543** (Transaction mode):
> ```
> postgresql://postgres.[REF]:[HASŁO]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
> ```
> Znajdziesz to w: **Settings → Database → Connection pooling → Transaction mode**

### 2.3 Uruchom migrację lokalnie

```bash
# Utwórz plik .env.local
cp .env.example .env.local
# Wklej DATABASE_URL z Supabase

# Wygeneruj klienta Prisma
npx prisma generate

# Wykonaj migrację (tworzy tabele)
npx prisma migrate deploy

# Uruchom migration.sql (triggery + seed marek)
# Opcja A: przez Supabase SQL Editor (patrz niżej)
# Opcja B: lokalnie przez psql
psql "postgresql://postgres:[HASŁO]@db.xxx.supabase.co:5432/postgres" -f migration.sql
```

**Opcja A — Supabase SQL Editor (zalecana):**
1. W panelu: **SQL Editor → New query**
2. Wklej zawartość `migration.sql`
3. Kliknij **Run**

### 2.4 Sprawdź dane

W panelu Supabase: **Table Editor** → powinieneś widzieć tabele `users`, `listings`, `makes` itp.
Tabela `makes` powinna mieć 22 marki (Volkswagen, BMW itd.)

---

## Krok 3 — Autentykacja Clerk

### 3.1 Utwórz aplikację

1. Wejdź na **clerk.com** → Sign up → **Create application**
2. Nazwa: `Automarket`
3. Włącz metody logowania: **Email + Google**
4. Kliknij **Create application**

### 3.2 Pobierz klucze API

W panelu Clerk: **API Keys**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3.3 Skonfiguruj webhook (synchronizacja użytkowników)

1. Clerk panel: **Webhooks → Add Endpoint**
2. URL: `https://TWOJA-DOMENA.vercel.app/api/webhooks/clerk`
   (wróć tu po wdrożeniu na Vercel — najpierw zrób krok 4, potem wróć)
3. Zaznacz events: `user.created`, `user.updated`, `user.deleted`
4. Skopiuj **Signing Secret** → to będzie `CLERK_WEBHOOK_SECRET`

---

## Krok 4 — Przechowywanie zdjęć Cloudinary

### 4.1 Utwórz konto

1. Wejdź na **cloudinary.com** → Sign up (darmowy tier: 25 GB)
2. W dashboardzie znajdziesz: **Cloud name**, **API Key**, **API Secret**

### 4.2 Utwórz folder

W panelu Cloudinary: **Media Library → New folder** → nazwa: `automarket`

---

## Krok 5 — Wdrożenie na Vercel

### 5.1 Połącz z GitHub

1. Wejdź na **vercel.com** → Sign up → **Add New Project**
2. Wybierz repozytorium `automarket` z GitHuba
3. Framework: **Next.js** (wykryty automatycznie)

### 5.2 Dodaj zmienne środowiskowe

W sekcji **Environment Variables** dodaj wszystkie zmienne:

| Zmienna | Wartość |
|---|---|
| `DATABASE_URL` | Connection string z Supabase (pooler, port 6543) |
| `DIRECT_URL` | Connection string z Supabase (direct, port 5432) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | pk_test_... z Clerk |
| `CLERK_SECRET_KEY` | sk_test_... z Clerk |
| `CLERK_WEBHOOK_SECRET` | whsec_... z Clerk Webhooks |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | /logowanie |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | /rejestracja |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | / |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | / |
| `CLOUDINARY_CLOUD_NAME` | Twoja nazwa z Cloudinary |
| `CLOUDINARY_API_KEY` | Klucz API z Cloudinary |
| `CLOUDINARY_API_SECRET` | Sekret API z Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Twoja nazwa z Cloudinary |
| `NEXT_PUBLIC_APP_URL` | https://automarket.vercel.app |

### 5.3 Zaktualizuj schema.prisma dla Supabase

Dodaj `directUrl` do `datasource db` w `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")   // ← dodaj tę linię
}
```

Wypchnij zmianę:
```bash
git add prisma/schema.prisma
git commit -m "fix: add directUrl for Supabase"
git push
```

### 5.4 Deploy

Kliknij **Deploy**. Vercel zbuduje aplikację (~2 minuty).

Po wdrożeniu dostaniesz URL: `https://automarket-xyz.vercel.app`

---

## Krok 6 — Konfiguracja po wdrożeniu

### 6.1 Zaktualizuj webhook Clerk

Wróć do **Clerk → Webhooks** i wpisz prawdziwy URL:
```
https://automarket-xyz.vercel.app/api/webhooks/clerk
```

### 6.2 Zaktualizuj NEXT_PUBLIC_APP_URL

W **Vercel → Settings → Environment Variables** zmień:
```
NEXT_PUBLIC_APP_URL=https://automarket-xyz.vercel.app
```

Redeploy: **Vercel → Deployments → ... → Redeploy**

### 6.3 Ustaw domenę Clerk

W **Clerk → Domains** dodaj swoją domenę Vercel.

---

## Krok 7 — Weryfikacja

Sprawdź kolejno:

```
✅ https://automarket-xyz.vercel.app          → strona główna ładuje się
✅ https://automarket-xyz.vercel.app/ogloszenia → lista ogłoszeń (pusta na start)
✅ Rejestracja konta                            → użytkownik pojawia się w Supabase (tabela users)
✅ Dodanie ogłoszenia                           → pojawia się na liście
✅ Upload zdjęcia                               → zdjęcie widoczne w Cloudinary
```

---

## Typowe problemy

### "PrismaClientInitializationError" na Vercelu
Upewnij się, że `DATABASE_URL` używa portu **6543** (pooler), a `DIRECT_URL` portu **5432** (direct).

### Clerk redirect loop
Sprawdź czy `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/logowanie` — musisz też stworzyć stronę `/app/logowanie/page.tsx`:
```tsx
import { SignIn } from "@clerk/nextjs";
export default function Page() {
  return <div style={{display:"flex",justifyContent:"center",padding:"60px 0"}}>
    <SignIn />
  </div>;
}
```
I analogicznie `/app/rejestracja/page.tsx` z `<SignUp />`.

### Webhook Clerk nie działa
Sprawdź **Clerk → Webhooks → Recent deliveries** — tam zobaczysz błędy.
Najczęstsza przyczyna: zły `CLERK_WEBHOOK_SECRET`.

### Zdjęcia nie uploadują się
Sprawdź czy `CLOUDINARY_API_SECRET` jest ustawiony (nie tylko `NEXT_PUBLIC_*`).

---

## Continuous deployment

Od teraz każdy `git push` do `main` automatycznie wdraża nową wersję na Vercel. Zmiany są live w ~60 sekund.

```bash
# Standardowy workflow
git add .
git commit -m "feat: opis zmiany"
git push
# → Vercel automatycznie deployuje
```

---

## Darmowe limity (wystarczą na start)

| Serwis | Darmowy limit |
|---|---|
| Vercel Hobby | 100 GB bandwidth/mies., brak limitu deploymentów |
| Supabase Free | 500 MB bazy, 2 GB bandwidth, 50 000 req/mies. |
| Cloudinary Free | 25 GB storage, 25 GB bandwidth/mies. |
| Clerk Free | 10 000 MAU (miesięcznie aktywnych użytkowników) |
