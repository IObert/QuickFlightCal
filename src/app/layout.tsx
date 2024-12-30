import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickFlightCal ✈️ | Flight Calendar Links Generator",
  description:
    "Easily generate calendar links for your flights! Enter your flight details and create calendar entries in just a few clicks. Supports multiple flight legs and seamless integration with popular calendar apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TooltipProvider>
        <body className={inter.className}>
          <span className="absolute right-0 translate-x-20 rotate-45 top-0 py-2 text-xs px-20 my-4 bg-gray-500 text-white">
            <a
              target="_blank"
              href="https://github.com/IObert/QuickFlightCal/issues"
            >
              Report issues
            </a>
          </span>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </body>
      </TooltipProvider>
      <footer className="fixed bottom-0 w-full  p-4 text-center">
        Made with ❤️ in Munich
      </footer>
    </html>
  );
}
