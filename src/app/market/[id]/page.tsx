"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProbabilityChart } from "@/components/Charts/ProbabilityChart";
import { TradeModal } from "@/components/TradeModal";
import { useWallet } from "@/components/WalletContextProvider";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";

export default function MarketPage() {
  const { id } = useParams();
  const { connected, connect } = useWallet();
  const [market, setMarket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Poll for updates (Price, Volume, etc.)
    const fetchMarket = () => {
        fetch("/api/markets") // In prod: /api/markets/[id]
          .then((res) => res.json())
          .then((data) => {
            const found = data.find((m: any) => m.id === Number(id));
            setMarket(found);
            setLoading(false);
          });
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading market details...</div>;
  if (!market) return <div className="text-center py-20">Market not found.</div>;

  return (
    <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Markets
        </Link>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
            <h1 className="text-3xl font-bold mb-4">{market.question}</h1>
            <p className="text-gray-400 mb-8">{market.description || "No description provided."}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                   <h3 className="text-lg font-semibold mb-4 text-purple-400">Probability Trend</h3>
                   <div className="h-64">
                       <ProbabilityChart yesPrice={market.yesPrice} noPrice={market.noPrice} height={250} />
                   </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 bg-gray-900 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400">Current Volume</span>
                            <span className="font-mono text-xl">${market.volume ? market.volume.toLocaleString() : '0'}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400">End Date</span>
                            <span>{market.endDate || "N/A"}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-900/20 border border-green-900 hover:bg-green-900/40 text-green-400 transition-colors"
                            >
                                <span className="font-bold text-lg">YES</span>
                                <span className="text-sm">{(market.yesPrice * 100).toFixed(1)}%</span>
                            </button>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex flex-col items-center justify-center p-4 rounded-lg bg-red-900/20 border border-red-900 hover:bg-red-900/40 text-red-400 transition-colors"
                            >
                                <span className="font-bold text-lg">NO</span>
                                <span className="text-sm">{(market.noPrice * 100).toFixed(1)}%</span>
                            </button>
                        </div>
                        
                        {!connected && (
                            <div className="mt-6 flex justify-center">
                                <button 
                                    onClick={connect}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all text-sm"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Connect to Trade
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <TradeModal 
            market={market} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
        />
    </div>
  );
}
