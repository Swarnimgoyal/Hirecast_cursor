"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { Shield, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface TradeModalProps {
  market: {
    id: number;
    question: string;
    yesPrice: number;
    noPrice: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const TradeModal = ({ market, isOpen, onClose }: TradeModalProps) => {
  const { connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTrade = () => {
    // Simulate trade execution
    setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onClose();
        }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={twMerge(
          "w-full max-w-md rounded-2xl border p-6 transition-colors duration-300",
          isPrivate ? "bg-gray-900 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]" : "bg-gray-800 border-gray-700"
      )}>
        {!connected ? (
            <div className="text-center py-8">
                <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Wallet Required</h3>
                <p className="text-gray-400 mb-6">You must connect your Solana wallet to place a trade.</p>
                <div className="flex justify-center">
                    <WalletMultiButton className="!bg-purple-600" />
                </div>
                <button onClick={onClose} className="mt-6 text-sm text-gray-500 hover:text-white">Cancel</button>
            </div>
        ) : (
            <>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Place Trade</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-500">Trade Executed!</h3>
                        <p className="text-gray-400">{isPrivate ? "Transaction details are encrypted." : "View on Solscan."}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-gray-400 mb-1">Market</p>
                            <p className="font-semibold">{market.question}</p>
                        </div>

                        <div>
                             <label className="text-sm text-gray-400 mb-1 block">Amount (USDC)</label>
                             <input 
                                type="number" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="0.00"
                             />
                        </div>

                        {/* Privacy Toggle */}
                        <div className={twMerge(
                            "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                            isPrivate ? "bg-purple-900/20 border-purple-500" : "bg-gray-900 border-gray-700"
                        )} onClick={() => setIsPrivate(!isPrivate)}>
                            <div className="flex items-center gap-3">
                                {isPrivate ? <EyeOff className="text-purple-400" /> : <Eye className="text-gray-500" />}
                                <div>
                                    <p className={twMerge("font-bold", isPrivate ? "text-purple-400" : "text-gray-300")}>
                                        {isPrivate ? "Private Mode Active" : "Public Mode"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {isPrivate ? "Transaction details shielded" : "Standard SPL transfer"}
                                    </p>
                                </div>
                            </div>
                            <div className={twMerge(
                                "w-10 h-5 rounded-full relative transition-colors",
                                isPrivate ? "bg-purple-500" : "bg-gray-600"
                            )}>
                                <div className={twMerge(
                                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                    isPrivate ? "left-6" : "left-1"
                                )} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={handleTrade} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">
                                Buy YES ({market.yesPrice})
                            </button>
                            <button onClick={handleTrade} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">
                                Buy NO ({market.noPrice})
                            </button>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};
