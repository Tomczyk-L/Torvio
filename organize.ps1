# organize.ps1
# Uruchom z folderu: D:\_Projekty\_IT\Torvio
# Komenda: powershell -ExecutionPolicy Bypass -File organize.ps1

Write-Host "Torvio - organizacja struktury projektu..." -ForegroundColor Cyan

$dirs = @(
    "prisma",
    "src\app\ogloszenia\[slug]",
    "src\app\ogloszenia\nowe",
    "src\app\profil\ulubione",
    "src\app\profil\wiadomosci",
    "src\app\logowanie",
    "src\app\rejestracja",
    "src\app\api\listings\[id]\activate",
    "src\app\api\listings\[id]\images",
    "src\app\api\listings\[id]\sold",
    "src\app\api\listings\[id]",
    "src\app\api\listings\create",
    "src\app\api\messages",
    "src\app\api\favourites\[listingId]",
    "src\app\api\favourites",
    "src\app\api\webhooks\clerk",
    "src\components\home",
    "src\components\layout",
    "src\components\listings",
    "src\components\profile",
    "src\components\ui",
    "src\lib",
    "src\types"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
}

Write-Host "Katalogi utworzone." -ForegroundColor Green

function Move-Safe {
    param($src, $dst)
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Force
        Write-Host "  OK  $src -> $dst" -ForegroundColor Gray
    } else {
        Write-Host "  --  BRAK: $src" -ForegroundColor Yellow
    }
}

Write-Host "" 
Write-Host "Prisma..." -ForegroundColor Cyan
Move-Safe "schema.prisma"  "prisma\schema.prisma"
Move-Safe "migration.sql"  "prisma\migration.sql"
Move-Safe "init.sql"       "prisma\init.sql"

Write-Host ""
Write-Host "Strony app..." -ForegroundColor Cyan
Move-Safe "globals.css"                "src\app\globals.css"
Move-Safe "layout.tsx"                 "src\app\layout.tsx"
Move-Safe "home.page.tsx"              "src\app\page.tsx"
Move-Safe "ogloszenia.page.tsx"        "src\app\ogloszenia\page.tsx"
Move-Safe "listing-detail.page.tsx"    "src\app\ogloszenia\[slug]\page.tsx"
Move-Safe "nowe.page.tsx"              "src\app\ogloszenia\nowe\page.tsx"
Move-Safe "profil.layout.tsx"          "src\app\profil\layout.tsx"
Move-Safe "profil.page.tsx"            "src\app\profil\page.tsx"
Move-Safe "profil.ulubione.page.tsx"   "src\app\profil\ulubione\page.tsx"
Move-Safe "profil.wiadomosci.page.tsx" "src\app\profil\wiadomosci\page.tsx"
Move-Safe "logowanie.page.tsx"         "src\app\logowanie\page.tsx"
Move-Safe "rejestracja.page.tsx"       "src\app\rejestracja\page.tsx"

Write-Host ""
Write-Host "API routes..." -ForegroundColor Cyan
Move-Safe "api.listings.route.ts"          "src\app\api\listings\route.ts"
Move-Safe "api.listings.create.route.ts"   "src\app\api\listings\create\route.ts"
Move-Safe "api.listings.delete.route.ts"   "src\app\api\listings\[id]\route.ts"
Move-Safe "api.listings.activate.route.ts" "src\app\api\listings\[id]\activate\route.ts"
Move-Safe "api.listings.images.route.ts"   "src\app\api\listings\[id]\images\route.ts"
Move-Safe "api.listings.sold.route.ts"     "src\app\api\listings\[id]\sold\route.ts"
Move-Safe "api.messages.route.ts"          "src\app\api\messages\route.ts"
Move-Safe "api.favourites.route.ts"        "src\app\api\favourites\route.ts"
Move-Safe "api.favourites.check.route.ts"  "src\app\api\favourites\[listingId]\route.ts"
Move-Safe "api.webhooks.clerk.route.ts"    "src\app\api\webhooks\clerk\route.ts"

Write-Host ""
Write-Host "Components..." -ForegroundColor Cyan
Move-Safe "Header.tsx"          "src\components\layout\Header.tsx"
Move-Safe "Footer.tsx"          "src\components\layout\Footer.tsx"
Move-Safe "HomeSearch.tsx"      "src\components\home\HomeSearch.tsx"
Move-Safe "ListingCard.tsx"     "src\components\listings\ListingCard.tsx"
Move-Safe "ListingFilters.tsx"  "src\components\listings\ListingFilters.tsx"
Move-Safe "ListingSort.tsx"     "src\components\listings\ListingSort.tsx"
Move-Safe "ListingGallery.tsx"  "src\components\listings\ListingGallery.tsx"
Move-Safe "ContactForm.tsx"     "src\components\listings\ContactForm.tsx"
Move-Safe "FavouriteButton.tsx" "src\components\listings\FavouriteButton.tsx"
Move-Safe "NewListingForm.tsx"  "src\components\listings\NewListingForm.tsx"
Move-Safe "ProfileNav.tsx"      "src\components\profile\ProfileNav.tsx"
Move-Safe "MyListingsTable.tsx" "src\components\profile\MyListingsTable.tsx"
Move-Safe "Pagination.tsx"      "src\components\ui\Pagination.tsx"

Write-Host ""
Write-Host "Lib + Types..." -ForegroundColor Cyan
Move-Safe "prisma.ts"     "src\lib\prisma.ts"
Move-Safe "utils.ts"      "src\lib\utils.ts"
Move-Safe "cloudinary.ts" "src\lib\cloudinary.ts"
Move-Safe "listings.ts"   "src\lib\listings.ts"
Move-Safe "types.ts"      "src\types\index.ts"

Write-Host ""
Write-Host "Sprawdzam tsconfig.json..." -ForegroundColor Cyan
$tsconfig = Get-Content "tsconfig.json" -Raw
if ($tsconfig -match '"@/\*"') {
    Write-Host "  OK  tsconfig.json ma skonfigurowane paths" -ForegroundColor Green
} else {
    Write-Host "  !!  tsconfig.json nie ma paths - zastap plik wersja z pobranych" -ForegroundColor Red
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Gotowe! Kolejne kroki:" -ForegroundColor Green
Write-Host "  1. npx prisma generate"
Write-Host "  2. npm run dev"
Write-Host "  3. Otworz http://localhost:3000"
Write-Host "==========================================" -ForegroundColor Cyan
