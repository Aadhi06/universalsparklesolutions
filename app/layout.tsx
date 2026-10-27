import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { getSiteUrl, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Cleaning Melbourne | ${site.shortName}`,
    template: `%s | ${site.shortName}`,
  },
  description:
    "Professional office, home, healthcare, education and builders cleaning across Melbourne Metropolitan Area and Regional Victoria.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon-32.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png?v=4", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png?v=4", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=4", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico?v=4", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=4", sizes: "180x180" }],
    shortcut: "/icon-32.png?v=4",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: site.shortName,
    title: `${site.shortName} | Cleaning & Facility Support`,
    description:
      "Office, home, healthcare, education and builders cleaning across Melbourne Metropolitan Area and Regional Victoria.",
    url: siteUrl,
    images: [
      {
        url: "/images/hero-office.jpg",
        alt: "A bright modern commercial interior maintained to a professional standard.",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    url: siteUrl,
    email: site.email,
    telephone: ["+61402603869", "+61433708709"],
    areaServed: [
      "Melbourne Metropolitan Area",
      "Regional Victoria",
      "Victoria, Australia",
    ],
    description:
      "Commercial cleaning and facility support across Melbourne Metropolitan Area and Regional Victoria.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Melbourne",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  };

  return (
    <html
      lang="en-AU"
      className={`${inter.variable} ${manrope.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
