import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Header, Preloader } from "@/layout";
import "./globals.css";
import { ReactNode } from "react";
import CustomCursor from "@/components/custom-cursor";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmed Hive | Product Manager & Product Designer",
  description:
    "Product Manager and Product Designer helping founders turn complex ideas into clean, high converting digital products.",
  applicationName: "Ahmed Hive | Product Manager & Product Designer",
  authors: [{ name: "ahmersdev" }],
  referrer: "origin-when-cross-origin",
  creator: "ahmer",
  publisher: "ahmersdev",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://ahmedhive.com/"),
  openGraph: {
    title: "Ahmed Hive | Product Manager & Product Designer",
    description:
      "Product Manager and Product Designer helping founders turn complex ideas into clean, high converting digital products.",
    url: "https://ahmedhive.com/",
    siteName: "Ahmed Hive | Product Manager & Product Designer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmed Hive | Product Manager & Product Designer",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Hive | Product Manager & Product Designer",
    description:
      "Product Manager and Product Designer helping founders turn complex ideas into clean, high converting digital products.",
    creator: "@ahmersdev",
    images: {
      url: "/og-image.png",
      alt: "Ahmed Hive | Product Manager & Product Designer",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "light",
  themeColor: "#FDFDFD",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CustomCursor />
        <Preloader />
        <Header />
        {children}
      </body>
    </html>
  );
}
