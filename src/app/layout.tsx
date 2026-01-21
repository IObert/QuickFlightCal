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
          <div className="fixed bottom-0 right-[-25px] overflow-hidden w-40 h-40 z-50 pointer-events-none">
            <a
              target="_blank"
              href="https://github.com/IObert/QuickFlightCal/issues"
              className="absolute bottom-8 -right-10 w-56 py-2.5 bg-gray-600 text-white text-center text-xs font-medium transform -rotate-45 shadow-md hover:bg-gray-700 transition-colors pointer-events-auto"
            >
              Report Issues
            </a>
          </div>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          <footer className="w-full p-4 text-center text-gray-600 text-sm mt-8">
            Made with 💙 in Munich by <a target="_blank" href="https://iobert.me">Marius Obert</a>
          </footer>
        </body>
      </TooltipProvider>

    </html>
  );
}
