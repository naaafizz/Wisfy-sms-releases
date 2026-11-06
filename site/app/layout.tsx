import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wisfy SMS — Download the Latest APK",
  description:
    "Wisfy SMS is an open-source, backend-free Android app that forwards merchant payment SMS (bKash, Nagad, Rocket, Upay) to your own webhook endpoint. Download the latest APK straight from the official OTA feed.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
