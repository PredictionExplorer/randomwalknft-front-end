import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/app-providers";

const kelsonSans = localFont({
  src: [
    {
      path: "../assets/fonts/KelsonSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/KelsonSans-Normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/KelsonSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const editorialSans = localFont({
  src: [
    {
      path: "../assets/fonts/KelsonSans-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/KelsonSans-Normal.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://randomwalknft.com"),
  title: {
    default: "Random Walk NFT",
    template: "%s | Random Walk NFT",
  },
  description:
    "Programmatically generated Random Walk image and video NFTs with an art-led minting, gallery, and fee-free marketplace experience.",
  applicationName: "Random Walk NFT",
  keywords: ["NFT", "Arbitrum", "generative art", "random walk", "marketplace"],
  openGraph: {
    title: "Random Walk NFT",
    description:
      "Programmatically generated Random Walk image and video NFTs with live minting and marketplace activity on Arbitrum.",
    siteName: "Random Walk NFT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Random Walk NFT",
    description:
      "Programmatically generated Random Walk image and video NFTs with live minting and marketplace activity on Arbitrum.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${kelsonSans.variable} ${editorialSans.variable} bg-canvas text-foreground antialiased`}
      >
        <AppProviders>
          <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,191,255,0.16),_transparent_38%),linear-gradient(180deg,_#050507_0%,_#07070a_35%,_#111118_100%)]">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(circle_at_top,_rgba(198,118,215,0.28),_transparent_65%)]" />
            <SiteHeader />
            <main className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-7xl flex-col px-4 pt-28 pb-20 sm:px-6 lg:px-8">
              {children}
            </main>
            <SiteFooter />
          </div>
          <Toaster richColors position="top-right" />
        </AppProviders>
      </body>
    </html>
  );
}
