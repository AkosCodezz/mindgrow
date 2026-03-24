import { getSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * POST /auth/signout – Kijelentkezési Route Handler.
 *
 * Server oldalon hajtja végre a signOut-ot, hogy a cookie
 * azonnal törlődjön a szerveren is (nem csak a böngészőben).
 */
export async function POST() {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), {
    status: 302,
  });
}

