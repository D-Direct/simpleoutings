import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SimpleOutings - Beautiful Websites for Sri Lankan Homestays",
  description: "Create stunning websites for your homestay or guesthouse in Sri Lanka. Launch in minutes, manage bookings, and keep 100% of your revenue. Stop paying 20% commission to booking platforms.",
  keywords: [
    "Sri Lanka homestays",
    "guesthouse website builder",
    "vacation rental websites",
    "homestay booking system",
    "Sri Lanka accommodation",
    "property management software",
    "direct booking websites",
    "Airbnb alternative Sri Lanka",
    "commission-free bookings",
    "homestay management"
  ],
  authors: [{ name: "SimpleOutings" }],
  creator: "SimpleOutings",
  publisher: "SimpleOutings",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simpleoutings.com",
    siteName: "SimpleOutings",
    title: "SimpleOutings - Beautiful Websites for Sri Lankan Homestays",
    description: "Stop paying 20% commission. Create your own professional homestay website in minutes.",
    images: [
      {
        url: "/uploads/Simpleoutings-Hero.jpg",
        width: 1200,
        height: 630,
        alt: "SimpleOutings - Homestay Website Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SimpleOutings - Beautiful Websites for Sri Lankan Homestays",
    description: "Stop paying 20% commission. Create your own professional homestay website in minutes.",
    images: ["/uploads/Simpleoutings-Hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
