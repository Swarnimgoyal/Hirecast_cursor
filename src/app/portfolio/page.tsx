"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

interface Position {
    wallet: string;
    marketId: number;
    sharesYes: number;
    sharesNo: number;
    marketQuestion: string;
    currentYesPrice: number;
    currentNoPrice: number;
}

export default function PortfolioPage() {
    const { connected, publicKey } = useWallet();
    const walletAddress = publicKey?.toString();
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (connected && walletAddress) {
            setLoading(true);
            fetch(`/api/portfolio?wallet=${walletAddress}`)
                .then(res => res.json())
                .then(data => {
                    setPositions(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load portfolio:", err);
                    setLoading(false);
                });
        }
    }, [connected, walletAddress]);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold mb-8">Your Portfolio</h1>
                
                {!connected ? (
                    <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                        <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
                        <p className="text-gray-400">Connect your Phantom wallet to view your positions.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                            <div>
                                <p className="text-sm text-gray-400">Connected Wallet</p>
                                <p className="font-mono text-lg">{walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">Loading positions...</div>
                        ) : positions.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl">
                                <p className="text-gray-500 mb-4">No active positions found.</p>
                                <Link href="/" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold transition-colors inline-block text-sm">
                                    Explore Markets
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {positions.map((pos, idx) => {
                                    const hasYes = pos.sharesYes > 0;
                                    const hasNo = pos.sharesNo > 0;

                                    return (
                                        <div key={idx} className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors">
                                            <h3 className="font-bold text-lg mb-4">{pos.marketQuestion}</h3>
                                            
                                            <div className="flex flex-wrap gap-4">
                                                {hasYes && (
                                                    <div className="flex items-center gap-4 bg-green-900/10 border border-green-900/50 rounded-lg p-3 px-5">
                                                        <div className="text-green-500 font-bold text-xl">YES</div>
                                                        <div>
                                                            <div className="text-xs text-gray-400">SHARES</div>
                                                            <div className="font-mono font-bold">{pos.sharesYes}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-400">CURRENT VALUE</div>
                                                            <div className="font-mono text-green-400">
                                                                ${(pos.sharesYes * pos.currentYesPrice).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {hasNo && (
                                                    <div className="flex items-center gap-4 bg-red-900/10 border border-red-900/50 rounded-lg p-3 px-5">
                                                        <div className="text-red-500 font-bold text-xl">NO</div>
                                                        <div>
                                                            <div className="text-xs text-gray-400">SHARES</div>
                                                            <div className="font-mono font-bold">{pos.sharesNo}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-xs text-gray-400">CURRENT VALUE</div>
                                                            <div className="font-mono text-red-400">
                                                                ${(pos.sharesNo * pos.currentNoPrice).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
