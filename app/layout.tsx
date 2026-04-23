import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Converter — URL을 QR 코드로",
  description:
    "URL을 붙여넣고 SVG 또는 PNG로 다운로드하세요. 빠르고 간단한 QR 코드 생성기.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
