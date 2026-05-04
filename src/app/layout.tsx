import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Emphra | The Intelligence Layer for Modern Conversations",
  description: "Next-gen API for chat platforms. Automated moderation, smart replies, and contextual memory for engaging apps.",
  keywords: ["AI Moderation", "Community Safety", "LLM", "Smart Replies", "Content Moderation API"],
  authors: [{ name: "Emphra Team" }],
  openGraph: {
    title: "Emphra | AI-Powered Chat Intelligence",
    description: "The next-generation API for community safety and engagement.",
    url: "https://emphra.com",
    siteName: "Emphra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emphra Platform Overview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emphra | AI-Powered Chat Intelligence",
    description: "Automated moderation and engagement for modern apps.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
