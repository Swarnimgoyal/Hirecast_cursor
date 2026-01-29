"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          HireCast
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors" />
      </div>
    </nav>
  );
};
