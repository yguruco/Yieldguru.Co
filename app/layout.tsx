import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import ChatInterface from "@/components/chatbot/chat-interface";
import ContextProvider from "@/context";
import { headers } from "next/headers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "YieldGuru",
  description: "Invest in Emobility",
  icons: {
    icon: "/images/yg-logo.png",
    apple: "/images/yg-logo.png",
  },
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  return (
    <html lang="en" >
      <body className={inter.className}>
      <ContextProvider cookies={cookies}>
          {children}
          <ChatInterface />
        </ContextProvider>
      </body>
    </html>
  );
}
