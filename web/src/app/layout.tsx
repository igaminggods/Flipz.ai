import type { Metadata } from "next";
import { Outfit, Orbitron } from "next/font/google";
import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400","500","600","700","800"]
});

export const metadata: Metadata = {
  title: "CoinFlip Insights — AI Scanning for Profitable Windows",
  description: "Scan once daily to detect profitable CoinFlip windows before they are patched. Geo-optimized results and real-time timers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${sans.variable} ${display.variable} antialiased`}>
        <BackgroundFX />
        <div style={{position:'relative', zIndex:1}}>
          {children}
        </div>
      </body>
    </html>
  );
}
