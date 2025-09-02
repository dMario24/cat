import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dginori-cat-feeding.vercel.app'),
  title: "디지노리 새끼 고양이 밥주기 기록 🐾",
  description: "디지노리 새끼 고양이들의 소중한 밥주기 기록을 남기고 공유하는 공간입니다.",
  openGraph: {
    title: "디지노리 새끼 고양이 밥주기 기록 🐾",
    description: "디지노리 새끼 고양이들의 소중한 밥주기 기록을 남기고 공유하는 공간입니다.",
    type: "website",
    url: "/",
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: '디지노리 새끼 고양이 밥주기 기록',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "디지노리 새끼 고양이 밥주기 기록 🐾",
    description: "디지노리 새끼 고양이들의 소중한 밥주기 기록을 남기고 공유하는 공간입니다.",
    images: ['/api/og'],
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
      </body>
    </html>
  );
}
