"use client";

import { useWallet } from "@/components/WalletContextProvider";
import Link from "next/link";
import { Wallet } from "lucide-react";

export const Navbar = () => {
    const { connected, connect, disconnect, walletAddress } = useWallet();

    const handleConnect = () => {
        if (connected) {
            disconnect();
        } else {
            connect();
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    HireCast
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <Link href="/markets" className="text-gray-400 hover:text-white transition-colors font-medium">Markets</Link>
                    <Link href="/quests" className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition-colors">
                        <span className="bg-purple-500/20 px-2 py-0.5 rounded text-xs">NEW</span>
                        Quests
                    </Link>
                    <Link href="/arena" className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 transition-colors">
                        <span className="animate-pulse">🔥</span>
                        Arena
                    </Link>
                    <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors font-medium">Portfolio</Link>
                    <Link href="/leaderboard" className="text-gray-400 hover:text-white transition-colors font-medium">Leaderboard</Link>
                    <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/10">
                        Control Room
                    </Link>
                </div>
            </div>

            <button 
                onClick={handleConnect}
                className="flex items-center gap-2 bg-gray-900 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-900/20 text-white px-4 py-2 rounded-lg transition-all"
            >
                <Wallet className="w-4 h-4 text-purple-400" />
                {connected ? (
                    <span className="font-mono text-sm">
                        {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
                    </span>
                ) : (
                    <span className="text-sm font-bold">Connect Phantom</span>
                )}
            </button>
        </nav>
    );
};
