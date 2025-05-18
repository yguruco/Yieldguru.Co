import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "../components/onchainKit/providers";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YieldGuru",
  description: "Invest in Emobility",
  icons: {
    icon: "/images/YG LOGO.png",
    apple: "/images/YG LOGO.png",
  },
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <AuthProvider>
            <div className="flex-grow">{props.children}</div>
          </AuthProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
