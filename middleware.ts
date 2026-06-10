// middleware.ts — w root projektu (obok package.json)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher([
  "/profil(.*)",
  "/ogloszenia/nowe(.*)",
  "/api/listings/create(.*)",
  "/api/listings/:id/images(.*)",
  "/api/listings/:id/activate(.*)",
  "/api/messages(.*)",
  "/api/favourites(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
