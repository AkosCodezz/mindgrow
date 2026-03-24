import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Next.js Middleware – minden kérésnél frissíti a Supabase session tokent.
 *
 * Ez a fájl azért szükséges, mert Server Componentsben a cookie store
 * írásvédett; a token rotation (session frissítés) csak itt hajtható végre.
 *
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<import('next/server').NextResponse>}
 */
export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Session érvényesítése és automatikus frissítése (token rotation)
  await supabase.auth.getUser();

  return response;
}

/**
 * Csak ezekre az útvonalakra fut le a middleware.
 * Statikus fájlokat és Next.js belső útvonalakat kihagyjuk.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

