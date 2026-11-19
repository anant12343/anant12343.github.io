import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { profile } from "@/content/profile";
import { siteUrl, asset } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const display = localFont({
  src: "./fonts/Archivo.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
const body = localFont({
  src: "./fonts/InstrumentSans.woff2",
  variable: "--font-body",
  weight: "400 700",
  display: "swap",
});
const mono = localFont({
  src: "./fonts/JetBrainsMono.woff2",
  variable: "--font-mono",
  weight: "100 800",
  display: "swap",
  preload: false, // small labels only; don't compete with the hero image
});

const description =
  "Ananth Srivastav Madabhushini: an engineer turned data person turned marketer who builds things. PGDM Marketing at BIMTECH. Product, growth, analytics and no-code AI automation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name} · Portfolio`, template: `%s · ${profile.shortName} Madabhushini` },
  description,
  applicationName: "Ananth Madabhushini Portfolio",
  authors: [{ name: profile.name, url: siteUrl }],
  keywords: ["Ananth Madabhushini", "BIMTECH", "product", "growth", "marketing analytics", "AI automation", "Make.com", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${profile.name}`,
    title: `${profile.name} · Portfolio`,
    description,
    images: [{ url: asset("/og.png"), width: 1200, height: 630, alt: `${profile.name}: engineer turned data person turned marketer who builds things.` }],
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: `${profile.name} · Portfolio`, description, images: [asset("/og.png")] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F3EF" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0E" },
  ],
};

// Sets the theme before first paint (no flash). Saved choice > OS preference.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <Providers>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
