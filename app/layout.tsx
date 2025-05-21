import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "../components/onchainKit/providers";
import ChatInterface from "@/components/chatbot/chat-interface";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YieldGuru",
  description: "Invest in Emobility",
  icons: {
    icon: "/images/yg-logo.png",
    apple: "/images/yg-logo.png",
  },
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-x-hidden">
        <Providers>
          {props.children}
          <ChatInterface />
        </Providers>
      </body>
    </html>
  );
}
