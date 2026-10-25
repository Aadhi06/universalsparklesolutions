import type { Metadata, Viewport } from "next";
import { AdminPwa } from "@/components/admin/AdminPwa";
import { AdminSplash } from "@/components/admin/AdminSplash";

const startupImages = [
  ["750x1334", "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"],
  ["1170x2532", "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"],
  ["1284x2778", "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"],
  ["1290x2796", "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"],
  ["1206x2622", "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3)"],
  ["1320x2868", "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3)"],
  ["1536x2048", "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)"],
  ["1668x2388", "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)"],
  ["2048x2732", "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)"],
].map(([size, media]) => ({
  url: `/admin/splash-${size}.png`,
  media: `${media} and (orientation: portrait)`,
}));

export const viewport: Viewport = {
  themeColor: "#102342",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
  applicationName: "USS Admin",
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "USS Admin",
    statusBarStyle: "black-translucent",
    startupImage: startupImages,
  },
  icons: {
    icon: [
      { url: "/admin/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/admin/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/admin/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminSplash />
      <AdminPwa />
      {children}
    </>
  );
}
