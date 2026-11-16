import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";

export const metadata: Metadata = {
  title: "Blog app",
  description: "Full Stack Open part 14 blog application",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Suspense fallback={<nav className="bg-slate-800 px-6 py-3" />}>
          <Navbar />
        </Suspense>
        <Suspense fallback={null}>
          <Notification />
        </Suspense>
        <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
