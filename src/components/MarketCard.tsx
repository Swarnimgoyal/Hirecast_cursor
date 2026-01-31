"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrendingUp, Users } from "lucide-react";

interface Market {
  id: number;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

interface MarketCardProps {
  market: Market;
  onTrade: (market: Market) => void;
  connected: boolean;
}

export function MarketCard({ market, onTrade, connected }: MarketCardProps) {
  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = Math.round(market.noPrice * 100);

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-gray-800 bg-gray-900/40 p-5 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-gray-900/60 hover:shadow-xl hover:shadow-purple-900/10">
      
      {/* Header */}
      <div className="mb-4">
        <Link 
            href={`/market/${market.id}`} 
            className="block mb-3"
        >
            <h3 className="text-xl font-bold leading-tight text-gray-100 transition-colors group-hover:text-purple-300">
            {market.question}
            </h3>
        </Link>
        
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Vol: ${market.volume.toLocaleString()}</span>
            </div>
            {/* Placeholder for future tags or expiry */}
            <div className="flex items-center gap-1">
                 <div className={`h-1.5 w-1.5 rounded-full ${market.volume > 1000 ? 'bg-green-500' : 'bg-gray-600'}`} />
                 <span>{market.volume > 1000 ? 'Active' : 'New'}</span>
            </div>
        </div>
      </div>

      {/* Trading Actions */}
      <div className="mt-auto space-y-3">
        {/* Visual Probability Bar */}
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-800">
            <div style={{ width: `${yesPercent}%` }} className="bg-green-500 transition-all duration-500" />
            <div style={{ width: `${noPercent}%` }} className="bg-red-500 transition-all duration-500" />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={() => onTrade(market)}
                className="group/btn relative flex flex-col items-center justify-center rounded-lg border border-green-900/30 bg-green-950/10 py-2.5 transition-all hover:border-green-500/50 hover:bg-green-950/30 active:scale-95"
            >
                <span className="text-xs font-medium text-green-700 uppercase tracking-wider group-hover/btn:text-green-400">Yes</span>
                <span className="text-lg font-bold text-green-500">{yesPercent}%</span>
            </button>

            <button
                onClick={() => onTrade(market)}
                className="group/btn relative flex flex-col items-center justify-center rounded-lg border border-red-900/30 bg-red-950/10 py-2.5 transition-all hover:border-red-500/50 hover:bg-red-950/30 active:scale-95"
            >
                <span className="text-xs font-medium text-red-700 uppercase tracking-wider group-hover/btn:text-red-400">No</span>
                <span className="text-lg font-bold text-red-500">{noPercent}%</span>
            </button>
        </div>
      </div>

      {/* Footer / Connect Prompt */}
      <div className="mt-4 border-t border-gray-800/50 pt-3 text-center">
            {connected ? (
                <button 
                    onClick={() => onTrade(market)}
                    className="flex w-full items-center justify-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-purple-400"
                >
                    <TrendingUp className="h-3 w-3" />
                    Trade Now
                </button>
            ) : (
                <span className="text-xs text-gray-600">Connect wallet to trade</span>
            )}
      </div>
    </div>
  );
}
