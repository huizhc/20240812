import BaiDuAnalytics from "@/components/BaiDuAnalytics";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <BaiDuAnalytics />
      <body>{children}</body>
    </html>
  );
}
