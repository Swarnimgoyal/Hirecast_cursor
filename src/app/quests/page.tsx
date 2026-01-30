"use client";

import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/components/WalletContextProvider";
import { useEffect, useState } from "react";
import { Flame, Trophy, Star, Lock, Timer, ArrowRight, Zap } from "lucide-react";

export default function QuestsPage() {
    const { connected, walletAddress } = useWallet();
    const [quests, setQuests] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);

    // Fetch Dynamic Data
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/quests");
                const data = await res.json();
                
                // Map API data to UI structure if needed (though we kept it consistent)
                const mapped = data.map((q: any) => ({
                    id: q.id,
                    title: q.title,
                    desc: q.description,
                    xp: q.rewardXp,
                    status: q.status,
                    time: q.expiresIn,
                    marketId: q.marketId
                }));
                setQuests(mapped);
            } catch (e) {
                console.error(e);
            }

            if (connected) {
                // Mock Stats for now, or fetch from /api/user/stats if we had it
                setStats({ xp: 1250, level: 2, streak: 5 });
            }
        };
        
        load();
        const interval = setInterval(load, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [connected]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                            Quest Board
                        </h1>
                        <div className="bg-gray-900/40 p-4 rounded-xl border-l-4 border-purple-500 max-w-2xl">
                             <h4 className="text-lg font-bold text-white mb-1">What are Quests?</h4>
                             <p className="text-gray-400">
                                Quests are <span className="text-purple-400 font-bold">time-limited challenges</span> tied to real prediction markets. 
                                Complete them by predicting correctly on specific topics to earn <span className="text-yellow-400">XP</span>, 
                                level up your profile, and unlock exclusive rewards. New quests drop every 24 hours.
                            </p>
                        </div>
                    </div>

                    {/* Stats Card */}
                    {connected && stats && (
                        <div className="flex gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-3 px-4 border-r border-gray-700">
                                <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Level {stats.level}</p>
                                    <p className="text-xl font-mono font-bold">{stats.xp} XP</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-3 px-2">
                                <div className="p-2 bg-orange-500/10 rounded-full text-orange-500">
                                    <Flame className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Streak</p>
                                    <p className="text-xl font-mono font-bold">{stats.streak} Days</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quests Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quests.map((quest) => (
                        <div key={quest.id} className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col">
                            
                            {/* Status Badge */}
                            <div className="absolute top-6 right-6">
                                {quest.status === "LOCKED" ? (
                                    <Lock className="w-5 h-5 text-gray-600" />
                                ) : (
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded-full">
                                        <Timer className="w-3 h-3" /> {quest.time}
                                    </span>
                                )}
                            </div>

                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-900/30 text-purple-400 text-xs font-bold mb-4 border border-purple-500/20">
                                    +{quest.xp} XP REWARD
                                </span>
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{quest.title}</h3>
                                <p className="text-gray-400 text-sm">{quest.desc}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-800">
                                <a href={`/market/${quest.marketId}`} className={`
                                    w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all
                                    ${quest.status === "LOCKED" 
                                        ? "bg-gray-800 text-gray-500 cursor-not-allowed" 
                                        : "bg-white text-black hover:bg-purple-400 hover:text-white hover:shadow-lg"}
                                `}>
                                    {quest.status === "LOCKED" ? "Locked" : "Start Quest"}
                                    {quest.status !== "LOCKED" && <ArrowRight className="w-4 h-4" />}
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
