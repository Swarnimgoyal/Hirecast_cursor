import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SolanaProvider } from "@/components/providers/SolanaProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEXUS | The Future of Prediction",
  description: "Trade on truth with NEXUS - The decentralized prediction protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <SolanaProvider>
          <Navbar />
          <main className="container mx-auto py-8">
            {children}
          </main>
        </SolanaProvider>
      </body>
    </html>
  );
}
