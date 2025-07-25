import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import CartDrawer from "@/components/cart/CartDrawer";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ModernShop - Premium E-commerce Experience",
  description: "Discover premium products with AI-powered shopping assistance",
  keywords: "ecommerce, shopping, premium products, AI assistant",
  authors: [{ name: "ModernShop Team" }],
  openGraph: {
    title: "ModernShop - Premium E-commerce Experience",
    description:
      "Discover premium products with AI-powered shopping assistance",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ModernShop - Premium E-commerce Experience",
    description:
      "Discover premium products with AI-powered shopping assistance",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
