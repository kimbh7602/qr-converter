import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "qr — url to qr, instantly",
  description:
    "Paste a URL, get a QR code. Download as SVG or PNG. Runs entirely in your browser.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={interTight.variable}>
      <body>{children}</body>
    </html>
  );
}
