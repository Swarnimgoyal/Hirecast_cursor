"use client";

import { useWallet } from "@/components/WalletContextProvider";
import { useEffect, useState } from "react";
import { UserStats } from "@/types";
import { gameService } from "@/services/game.service";
import { Trophy, Medal, Crown, Star } from "lucide-react";

export default function LeaderboardPage() {
    const { connected, walletAddress } = useWallet();
    const [leaders, setLeaders] = useState<UserStats[]>([]);

    useEffect(() => {
        const load = async () => {
             try {
                 const res = await fetch("/api/leaderboard");
                 const data = await res.json();
                 
                 // If the connected user isn't in the top list (which are usually mocked/seeded or limited), 
                 // we might simply display what the API returns. 
                 // For now, the API returns everyone in the DB.
                 //Done
                 setLeaders(data);
             } catch (e) {
                 console.error("Failed to load leaderboard", e);
             }
        };
        load();
        
        // Refresh every 10s to see updates
        const interval = setInterval(load, 10000);
        return () => clearInterval(interval);
    }, [connected, walletAddress]);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                     <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4">
                        <Crown className="w-12 h-12 text-yellow-500 fill-yellow-500/20" />
                        Hall of Fame
                    </h1>
                    <p className="text-gray-400 text-lg">Top predictors based on XP and Accuracy.</p>
                </div>

                <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl shadow-yellow-900/10">
                    <div className="grid grid-cols-12 gap-4 p-6 border-b border-gray-800 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <div className="col-span-1 text-center">Rank</div>
                        <div className="col-span-5">Predictor</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-2 text-center">Streak</div>
                        <div className="col-span-2 text-right">XP</div>
                    </div>

                    <div className="divide-y divide-gray-800/50">
                        {leaders.map((user, index) => {
                            let RankIcon = null;
                            let rowClass = "hover:bg-gray-800/30 transition-colors";
                            
                            if (index === 0) {
                                RankIcon = <Trophy className="w-6 h-6 text-yellow-500" />;
                                rowClass = "bg-yellow-900/10 hover:bg-yellow-900/20";
                            } else if (index === 1) {
                                RankIcon = <Medal className="w-6 h-6 text-gray-300" />;
                            } else if (index === 2) {
                                RankIcon = <Medal className="w-6 h-6 text-amber-600" />;
                            }

                            const isMe = user.wallet === walletAddress;

                            return (
                                <div key={index} className={`grid grid-cols-12 gap-4 p-6 items-center ${rowClass} ${isMe ? 'bg-purple-900/20 border-l-4 border-purple-500' : ''}`}>
                                    <div className="col-span-1 flex justify-center font-bold text-lg text-gray-400">
                                        {RankIcon || `#${index + 1}`}
                                    </div>
                                    <div className="col-span-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-mono border border-gray-700">
                                                {user.wallet.slice(0, 2)}
                                            </div>
                                            <div>
                                                <div className={`font-mono font-bold ${isMe ? 'text-purple-400' : 'text-gray-200'}`}>
                                                    {user.wallet} {isMe && "(You)"}
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    {user.badges.map(b => (
                                                        <span key={b} className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400 border border-gray-700">
                                                            {b}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center font-bold text-gray-300">
                                        Lvl {user.level}
                                    </div>
                                    <div className="col-span-2 text-center flex items-center justify-center gap-1 text-orange-400 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                        {user.streak}
                                    </div>
                                    <div className="col-span-2 text-right font-mono font-bold text-yellow-400 text-lg">
                                        {user.xp.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
