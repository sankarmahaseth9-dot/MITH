import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamVid - Video Streaming & Download",
  description: "Stream and download videos with our modern video platform. Features offline viewing, real-time stats, and admin dashboard.",
  keywords: ["StreamVid", "video streaming", "video download", "offline viewing", "Next.js", "PWA"],
  authors: [{ name: "StreamVid Team" }],
  icons: {
    icon: "/icon-192x192.png",
    apple: "/icon-192x192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StreamVid",
  },
  openGraph: {
    title: "StreamVid - Video Streaming & Download",
    description: "Stream and download videos with our modern video platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamVid - Video Streaming & Download",
    description: "Stream and download videos with our modern video platform",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
