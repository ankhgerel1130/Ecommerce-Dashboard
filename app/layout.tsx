import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import prismadb from "@/lib/prismadb"; 
import { ToasterProvider } from "@/providers/toast-provider";

const inter = Inter({ subsets: ['latin'] })

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  

  const store = prismadb.store
 
  return (
    <ClerkProvider>
    <html lang="en">
      
      <body
        className={inter.className}>
          <ToasterProvider />
        <ModalProvider/>
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
