import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";  // This is the correct import path
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Dictionary | Find Definitions Instantly",
  description: "Advanced dictionary application with audio pronunciation and examples",
  metadataBase: new URL(process.env.SITE_URL || "https://dictionary-app.example.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Smart Dictionary",
    description: "Find word definitions with pronunciation and examples",
    url: "/",
    siteName: "Smart Dictionary",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}