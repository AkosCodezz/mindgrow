import { createBrowserClient } from "@supabase/ssr";

/**
 * Singleton példány – egyszer jön létre, majd újra felhasználódik.
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
let client = null;

/**
 * Visszaadja a böngésző oldali Supabase klienst.
 *
 * Singleton pattern: az első híváskor létrehozza a klienst,
 * minden további híváskor ugyanazt a példányt adja vissza.
 * Így elkerüljük, hogy minden React render új kapcsolatot nyisson.
 *
 * Csak kliens komponensekben ("use client") hívható.
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 *
 * @example
 * "use client";
 * import { getSupabaseBrowserClient } from "@/lib/supabase/client";
 *
 * const supabase = getSupabaseBrowserClient();
 * const { data } = await supabase.from("profiles").select("*");
 */
export function getSupabaseBrowserClient() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return client;
}
