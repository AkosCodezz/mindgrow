import "./globals.css";

export const metadata = {
  title: "Next.js + Supabase Starter",
  description: "Next.js 14 App Router + Supabase Auth + Tailwind CSS",
};

/**
 * Root layout – minden oldal közös burkolója.
 * A Supabase session kezelése a middleware.js-ben történik,
 * itt nincs szükség külön inicializálásra.
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
