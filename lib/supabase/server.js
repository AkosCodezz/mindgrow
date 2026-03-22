import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Létrehozza a szerver oldali Supabase klienst.
 *
 * Minden szerver oldali kérésnél új példányt hoz létre, mivel
 * a Next.js `cookies()` store kérésenkénti élettartamú.
 *
 * Használható:
 *  - Server Componentsben
 *  - Server Actionsben ("use server" direktívát a hívó fájlba kell írni)
 *  - Route Handlersben (app/api/...)
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 *
 * @example – Server Component
 * import { getSupabaseServerClient } from "@/lib/supabase/server";
 *
 * export default async function Page() {
 *   const supabase = getSupabaseServerClient();
 *   const { data: { user } } = await supabase.auth.getUser();
 *   return <div>{user?.email}</div>;
 * }
 *
 * @example – Server Action
 * "use server";
 * import { getSupabaseServerClient } from "@/lib/supabase/server";
 *
 * export async function signOut() {
 *   const supabase = getSupabaseServerClient();
 *   await supabase.auth.signOut();
 * }
 */
export function getSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        /**
         * Egy adott nevű cookie értékét olvassa ki.
         * @param {string} name
         * @returns {string | undefined}
         */
        get(name) {
          return cookieStore.get(name)?.value;
        },

        /**
         * Beállít egy cookie-t a válasz fejlécébe.
         * Server Actionben és Route Handlerben működik;
         * Server Componentben a Set-Cookie header írásvédett
         * (a session frissítést a middleware.js kezeli).
         *
         * @param {string} name
         * @param {string} value
         * @param {import('@supabase/ssr').CookieOptions} options
         */
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Server Componentből nem írható cookie – ez várt viselkedés.
          }
        },

        /**
         * Törli a megadott nevű cookie-t.
         * @param {string} name
         * @param {import('@supabase/ssr').CookieOptions} options
         */
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Lásd a set() megjegyzést.
          }
        },
      },
    }
  );
}
