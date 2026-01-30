"use client";

import { useWallet } from "@/components/WalletContextProvider";
import { useState, useEffect } from "react";
import { TradeModal } from "@/components/TradeModal";
import Link from "next/link";
import { Wallet } from "lucide-react";

interface Market {
  id: number;
  question: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
}

export default function Home() {
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
      <section className="text-center py-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
          Trade on Future Outcomes
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          The decentralized prediction market on Solana.
        </p>
        {!connected && (
          <div className="flex justify-center">
            <button 
                onClick={connect}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-purple-500/50"
            >
                <Wallet className="w-5 h-5" />
                Connect Phantom Wallet
            </button>
          </div>
        )}
      </section>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading markets...</div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map((market) => (
            <div
                key={market.id}
                className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur hover:border-purple-500/50 transition-colors"
            >
                <Link href={`/market/${market.id}`} className="block hover:opacity-80 transition-opacity">
                    <h3 className="text-xl font-bold mb-4">{market.question}</h3>
                </Link>
                <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
                <span>Vol: ${market.volume.toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                <button 
                    onClick={() => openTrade(market)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-900/20 border border-green-900 hover:bg-green-900/40 text-green-400 transition-colors"
                >
                    <span className="font-bold">YES</span>
                    <span className="text-sm">{(market.yesPrice * 100).toFixed(1)}%</span>
                </button>
                <button 
                    onClick={() => openTrade(market)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-red-900/20 border border-red-900 hover:bg-red-900/40 text-red-400 transition-colors"
                >
                    <span className="font-bold">NO</span>
                    <span className="text-sm">{(market.noPrice * 100).toFixed(1)}%</span>
                </button>
                </div>
                
                <div className="mt-4 text-center">
                <button 
                    onClick={() => openTrade(market)}
                    className="text-xs text-gray-500 hover:text-purple-400 transition-colors"
                >
                    {connected ? "Click to Trade" : "Connect Wallet to Trade"}
                </button>
                </div>
            </div>
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
