import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";
import { Providers } from "./providers";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import EmotionRegistry from "./emotion-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enterprise rag",
  description: "enterprise rag",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="data-theme" suppressHydrationWarning>
      <head>
        <InitColorSchemeScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EmotionRegistry>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </EmotionRegistry>
      </body>
    </html>
  );
}
