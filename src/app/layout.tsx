import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HireCast | Solana Prediction Market",
  description: "Trade on outcomes with HireCast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <WalletContextProvider>
          <Navbar />
          <main className="container mx-auto py-8">
            {children}
          </main>
        </WalletContextProvider>
      </body>
    </html>
  );
}
