import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { getCatalogProducts } from "@/lib/catalog";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Action Replay | Hidden Event Archive",
    template: "%s | Action Replay",
  },
  description:
    "Action Replay streetwear artifacts, Galaxy tee, promo poster, and recovered archive fragments.",
  metadataBase: new URL("https://shopactionreplay.com"),
  openGraph: {
    title: "Action Replay",
    description:
      "Don't cheat the player. Cheat the game. Shop the Galaxy capsule.",
    url: "https://shopactionreplay.com",
    siteName: "Action Replay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Action Replay",
    description:
      "Galaxy tee, promo poster, and recovered streetwear artifacts.",
  },
};

export const viewport: Viewport = {
  themeColor: "#02040a",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchProducts = await getCatalogProducts();

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <SiteShell searchProducts={searchProducts}>{children}</SiteShell>
      </body>
    </html>
  );
}
