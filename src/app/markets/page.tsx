"use client";

import { useWallet } from "@/components/WalletContextProvider";
import { useState, useEffect } from "react";
import { TradeModal } from "@/components/TradeModal";
import { MarketCard } from "@/components/MarketCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Wallet } from "lucide-react";

interface Market {
  id: number;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

export default function MarketsPage() {
  const { connected, connect } = useWallet();
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = () => {
        fetch("/api/markets")
          .then((res) => res.json())
          .then((data) => {
            setMarkets(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch markets", err);
            setLoading(false);
          });
    };

    fetchMarkets(); // Initial fetch
    const interval = setInterval(fetchMarkets, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, []);
  const openTrade = (market: any) => {
      setSelectedMarket(market);
      setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 via-black to-black py-20 px-4 text-center border border-white/5 mx-4 md:mx-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-block mb-4 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-400 border border-purple-500/20">
                🚀 live on devnet
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6">
            Predict the Future
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
            The decentralized prediction market on Solana. <br/>Trade on news, crypto, and culture with instant settlement.
            </p>
            {!connected && (
            <div className="flex justify-center">
                <button 
                    onClick={connect}
                    className="group flex items-center gap-3 bg-white text-black hover:bg-gray-100 font-bold py-4 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
                >
                    <Wallet className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    Connect Wallet
                </button>
            </div>
            )}
        </div>
      </section>

      {loading ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[280px] rounded-xl border border-gray-800 bg-gray-900/40 p-5">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/4 mb-12" />
                    <div className="flex gap-3 mt-auto">
                        <Skeleton className="h-12 w-1/2" />
                        <Skeleton className="h-12 w-1/2" />
                    </div>
                </div>
            ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
            {markets.map((market) => (
                <MarketCard 
                    key={market.id} 
                    market={market} 
                    onTrade={openTrade} 
                    connected={connected} 
                />
            ))}
        </section>
      )}

      {selectedMarket && (
        <TradeModal 
            market={selectedMarket} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
