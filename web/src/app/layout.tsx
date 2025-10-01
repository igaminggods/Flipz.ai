import type { Metadata } from "next";
import { Outfit, Orbitron } from "next/font/google";
import Script from "next/script";
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
        <Script id="meta-pixel" strategy="beforeInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1444748290125993');fbq('track','PageView');`}</Script>
      </head>
      <body className={`${sans.variable} ${display.variable} antialiased`}>
        <noscript>
          <img height="1" width="1" style={{display:'none'}} src="https://www.facebook.com/tr?id=1444748290125993&ev=PageView&noscript=1" />
        </noscript>
        <BackgroundFX />
        <div style={{position:'relative', zIndex:1}}>
          {children}
        </div>
      </body>
    </html>
  );
}
