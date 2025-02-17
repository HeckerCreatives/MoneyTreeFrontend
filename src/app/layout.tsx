import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({ subsets: ["cyrillic"], weight: [  "200","300","400", "500", "600","700","800","900","1000"] });

export const metadata: Metadata = {
  title: "Money Tree",
  description: "Money Tree is a play-to-earn game where you can earn money by taking care of a virtual tree. You need to interact with the tree through simple actions to help it grow and yield rewards. The rewards you earn can be exchanged for real money. It’s easy, fun, and a great way to make money while enjoying the game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      suppressHydrationWarning
        className={`${nunito.className} antialiased bg-amber-50 flex items-center justify-center`}
      >
        <Suspense>
        {children}
        </Suspense>

        <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                className: '',
                 style:{
                  backgroundColor: '#451a03',
                    color: '#fff',
                    fontSize: '.8rem'
                 },
                 success: {
                  style: {
                    backgroundColor: '#451a03',
                    color: '#fff',
                  },
                },
              }}
              />
      </body>
    </html>
  );
}
