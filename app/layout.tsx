import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// โหลดฟอนต์และกำหนด CSS variables
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// ข้อมูล metadata ของเว็บ
export const metadata: Metadata = {
  title: "Gemini AI Chatbot",
  description: "A chatbot built with Next.js and OpenAI/Gemini",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white text-black">
        {children}
      </body>
    </html>
  );
}
