import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emphra — The Infrastructure Layer for Better Conversations",
  description:
    "Conversation intelligence API for modern platforms. Moderation, safety, and analytics — engineered for scale.",
  authors: [{ name: "Emphra" }],
  openGraph: {
    title: "Emphra — The Infrastructure Layer for Better Conversations",
    description:
      "Conversation intelligence API for modern platforms. Moderation, safety, and analytics — engineered for scale.",
    siteName: "Emphra",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground selection:bg-gold/25 selection:text-foreground`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
