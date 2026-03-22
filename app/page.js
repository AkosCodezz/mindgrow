import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await getSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

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
      <h1 className="text-3xl font-bold">MindGrow</h1>
      {user ? (
        <p>Bejelentkezve: {user.email}</p>
      ) : (
        <div className="flex gap-3 mt-4">
          <a href="/auth/login" className="px-4 py-2 bg-violet-600 text-white rounded-lg">Bejelentkezés</a>
          <a href="/auth/register" className="px-4 py-2 border border-white/20 text-white rounded-lg">Regisztráció</a>
        </div>
      )}
    </main>
  );
}