import "./globals.css";

export const metadata = {
  title: "MindGrow — Tanulj programozást valódi projekteken",
  description: "AI-vezérelt programozástanulási platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hu">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}