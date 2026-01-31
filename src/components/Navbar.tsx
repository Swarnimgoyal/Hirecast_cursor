"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const NavLink = ({ href, children, isNew, isHot }: { href: string; children: React.ReactNode; isNew?: boolean; isHot?: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    
    return (
        <Link 
            href={href} 
            className={cn(
                "transition-colors font-medium flex items-center gap-1.5",
                isActive ? "text-white" : "text-gray-400 hover:text-white",
                isNew && "text-purple-400 hover:text-purple-300 font-bold",
                isHot && "text-red-400 hover:text-red-300 font-bold"
            )}
        >
            {isNew && <span className="bg-purple-500/20 px-2 py-0.5 rounded text-[10px] leading-none uppercase tracking-wider">New</span>}
            {isHot && <span className="animate-pulse">🔥</span>}
            {children}
        </Link>
    );
};

export const Navbar = () => {
    const { connected, disconnect, publicKey } = useWallet();
    const { setVisible } = useWalletModal();

    const handleConnect = () => {
        if (connected) {
            disconnect();
        } else {
            setVisible(true);
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-black/50 border-b border-gray-800 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    NEXUS
                </Link>

                <div className="hidden md:flex gap-6 items-center">
                    <NavLink href="/markets">Markets</NavLink>
                    <NavLink href="/quests" isNew>Quests</NavLink>
                    <NavLink href="/arena" isHot>Arena</NavLink>
                    <NavLink href="/portfolio">Portfolio</NavLink>
                    <NavLink href="/leaderboard">Leaderboard</NavLink>
                    <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/10">
                        Admin Panel
                    </Link>
                </div>
            </div>

            <button 
                onClick={handleConnect}
                className="flex items-center gap-2 bg-gray-900 border border-purple-500/30 hover:border-purple-500 hover:bg-purple-900/20 text-white px-4 py-2 rounded-lg transition-all"
            >
                <Wallet className="w-4 h-4 text-purple-400" />
                {connected && publicKey ? (
                    <span className="font-mono text-sm">
                        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
                    </span>
                ) : (
                    <span className="text-sm font-bold">Connect Wallet</span>
                )}
            </button>
        </nav>
    );
};
