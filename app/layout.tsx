import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SnackOverflow — Predictive Snack Supply Chain",
  description: "Enterprise B2B SaaS that prevents the 3:00 PM office snack crash.",
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <body className={inter.className}>{children}</body>
    <GoogleAnalytics gaId="G-VKYKR8RBHG" />
  </html>
);

export default RootLayout;
