import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Nanit Reset",
  description: "An exclusive event for Nanit Australia — 15 November 2026, Sydney",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
