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
    "A forgotten Action Replay-style archive, hidden event portal, and streetwear drop system.",
  metadataBase: new URL("https://actionreplay.io"),
  openGraph: {
    title: "Action Replay",
    description:
      "Don't cheat the player. Cheat the game. Enter the archive and search for hidden codes.",
    url: "https://actionreplay.io",
    siteName: "Action Replay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Action Replay",
    description:
      "A lost cheat-code archive and hidden streetwear drop interface.",
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
