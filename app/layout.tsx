import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindGrow - Learn to Code Naturally with AI",
  description: "Master programming through AI-guided challenges, personalized feedback, and an adaptive learning path. Like Duolingo meets LeetCode with your personal AI coach.",
  keywords: ["coding", "programming", "learn to code", "AI tutor", "interactive learning", "code challenges"],
  authors: [{ name: "MindGrow Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mindgrow.dev",
    title: "MindGrow - Learn to Code Naturally with AI",
    description: "Master programming through AI-guided challenges and personalized feedback.",
    siteName: "MindGrow",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindGrow - Learn to Code Naturally with AI",
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
        {children}
      </body>
    </html>
  );
}
