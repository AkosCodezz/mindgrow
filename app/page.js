import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Főoldal – Server Component.
 * Lekéri a bejelentkezett felhasználót és a profil adatait.
 */
export default async function HomePage() {
  const supabase = getSupabaseServerClient();

  // Bejelentkezett felhasználó lekérése
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ha van bejelentkezett user, lekérjük a profilját is
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Next.js + Supabase Starter
        </h1>

        {user ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
            <p className="text-sm text-gray-500">Bejelentkezve</p>
            <p className="font-medium">{user.email}</p>
            {profile && (
              <p className="text-gray-600">
                @{profile.username}
                {profile.full_name ? ` · ${profile.full_name}` : ""}
              </p>
            )}
            {/* Kijelentkezés – Server Action */}
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="mt-2 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              >
                Kijelentkezés
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <p className="text-gray-600">Nem vagy bejelentkezve.</p>
            <div className="flex gap-3">
              <a
                href="/auth/login"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              >
                Bejelentkezés
              </a>
              <a
                href="/auth/register"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Regisztráció
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
