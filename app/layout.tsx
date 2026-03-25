import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

export const metadata: Metadata = {
  title: "CodeRift - Learn to Code Naturally with AI",
  description: "Master programming through AI-guided challenges, personalized feedback, and an adaptive learning path. Like Duolingo meets LeetCode with your personal AI coach.",
  keywords: ["coding", "programming", "learn to code", "AI tutor", "interactive learning", "code challenges"],
  authors: [{ name: "CodeRift Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://CodeRift.dev",
    title: "CodeRift - Learn to Code Naturally with AI",
    description: "Master programming through AI-guided challenges and personalized feedback.",
    siteName: "CodeRift",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeRift - Learn to Code Naturally with AI",
    description: "Master programming through AI-guided challenges and personalized feedback.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

