"use client";

import { Navbar } from "@/components/Navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { arenaService, ArenaProfile, ArenaQuest } from "@/services/arena.service";
import { useEffect, useState } from "react";
import { Brain, Zap, Users, Shield, Target, Lock } from "lucide-react";
import { TradeModal } from "@/components/TradeModal";

export default function ArenaPage() {
    const { connected, publicKey } = useWallet();
    const walletAddress = publicKey?.toString() || null;
    const [profile, setProfile] = useState<ArenaProfile | null>(null);
    const [quest, setQuest] = useState<ArenaQuest | null>(null);
    
    // Game State
    const [crowdGuess, setCrowdGuess] = useState(50);
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [hasPredicted, setHasPredicted] = useState(false);

    useEffect(() => {
        const load = async () => {
             // Dynamic Fetch
             const res = await fetch("/api/arena/quest");
             const q = await res.json();
             setQuest(q);

             if (connected && walletAddress) {
                 const p = await arenaService.getProfile(walletAddress);
                 setProfile(p);
             }
        };
        load();
        const interval = setInterval(load, 2000); // Fast Poll for Crowd Sentiment
        return () => clearInterval(interval);
    }, [connected, walletAddress]);

    const handleArenaSubmit = async () => {
        if (!connected) return;
        // 1. Submit Crowd Guess
        await arenaService.submitPrediction(walletAddress!, quest!.id, crowdGuess);
        // 2. Open Financial Bet
        setShowTradeModal(true);
        setHasPredicted(true);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans">
            
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Col: DNA Profile */}
                <div className="lg:col-span-1 space-y-8">
                    {/* DNA Card */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 backdrop-blur-sm">
                        <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-200">
                            <Brain className="w-5 h-5 text-red-500" />
                            Prediction DNA
                        </h2>
                        
                        {!connected ? (
                            <div className="text-center py-8 text-gray-500">Connect wallet to view DNA</div>
                        ) : profile ? (
                            <div className="space-y-6">
                                {/* DNA Bars */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs uppercase font-bold text-gray-400">
                                        <span>Contrarian</span>
                                        <span>{profile.dna.contrarian}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${profile.dna.contrarian}%` }}></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs uppercase font-bold text-gray-400">
                                        <span>Risk Taker</span>
                                        <span>{profile.dna.riskTaker}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${profile.dna.riskTaker}%` }}></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs uppercase font-bold text-gray-400">
                                        <span>Oracle Accuracy</span>
                                        <span>{profile.dna.oracle}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500" style={{ width: `${profile.dna.oracle}%` }}></div>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="pt-4 flex flex-wrap gap-2">
                                    {profile.badges.map(b => (
                                        <span key={b} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300">
                                            {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse h-32 bg-gray-800/50 rounded-xl"></div>
                        )}
                    </div>
                </div>

                {/* Center/Right: The Arena */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <Zap className="w-8 h-8 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold uppercase tracking-tight">The Arena</h1>
                            <p className="text-red-400 font-mono text-sm mb-4">LIVE EVENT • ENDS IN 14H 32M</p>
                            
                            <div className="bg-gray-900/60 p-4 rounded-xl border-l-4 border-red-500">
                                <h4 className="font-bold text-gray-200 mb-1">How it works:</h4>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    The Arena is a high-stakes <span className="text-red-400 font-bold">Dual-Reality Game</span>. 
                                    First, predict what the <span className="text-blue-400">Crowd</span> will do. 
                                    Then, place your financial bet on the actual outcome. 
                                    Prove you can outsmart the hive mind.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Quest Card */}
                    {quest && (
                        <div className="relative group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 overflow-hidden hover:border-red-500/30 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4 leading-tight">{quest.title}</h3>
                                <p className="text-xl text-gray-400 mb-8 max-w-2xl">{quest.context}</p>

                                {/* Dual Reality UI */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    
                                    {/* 1. Crowd Guess */}
                                    <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-4 text-blue-400">
                                            <Users className="w-5 h-5" />
                                            <span className="font-bold uppercase text-sm">Crowd Prediction</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-6">
                                            What % of people will bet YES?
                                        </p>
                                        
                                        <div className="relative h-12 flex items-center">
                                            <input 
                                                type="range" 
                                                min="0" max="100" 
                                                value={crowdGuess}
                                                onChange={(e) => setCrowdGuess(parseInt(e.target.value))}
                                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                                disabled={hasPredicted}
                                            />
                                            <div 
                                                className="absolute -top-8 px-2 py-1 bg-blue-500 text-white font-bold rounded text-xs transform -translate-x-1/2 transition-all"
                                                style={{ left: `${crowdGuess}%` }}
                                            >
                                                {crowdGuess}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Reality Bet */}
                                    <div className="p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50">
                                        <div className="flex items-center gap-2 mb-4 text-green-400">
                                            <Target className="w-5 h-5" />
                                            <span className="font-bold uppercase text-sm">Your Reality Bet</span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-6">
                                            Back your belief with USDC.
                                        </p>
                                        
                                        {!connected ? (
                                            <button className="w-full py-3 bg-gray-700 rounded-xl font-bold text-gray-400 cursor-not-allowed">
                                                Connect Wallet First
                                            </button>
                                        ) : hasPredicted ? (
                                             <div className="w-full py-3 bg-green-500/20 text-green-500 rounded-xl font-bold text-center border border-green-500/50">
                                                Locked In
                                             </div>
                                        ) : (
                                            <button 
                                                onClick={handleArenaSubmit}
                                                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20"
                                            >
                                                Lock Prediction
                                            </button>
                                        )}
                                    </div>

                                </div>

                                {hasPredicted && (
                                    <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-blue-400 mt-1" />
                                        <div>
                                            <h4 className="font-bold text-blue-400">Prediction Locked</h4>
                                            <p className="text-sm text-gray-400">
                                                Your crowd estimate of {crowdGuess}% has been recorded on your DNA profile.
                                                Prepare to sign the financial transaction.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reusing existing TradeModal for the financial leg */}
            {showTradeModal && quest && (
                <TradeModal 
                    market={{
                        id: quest.marketId,
                        question: quest.title,
                        yesPrice: 0.5,
                        noPrice: 0.5,
                        volume: 1000
                    }} 
                    onClose={() => setShowTradeModal(false)}
                    isOpen={showTradeModal}
                />
            )}
        </div>
    );
}
