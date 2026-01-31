"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export function CreateMarketSection() {
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        question: "",
        description: "",
        yesPrice: 0.5
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await fetch("/api/markets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: formData.question,
                    description: formData.description,
                    liquidityYes: 10000 * formData.yesPrice,
                    liquidityNo: 10000 * (1 - formData.yesPrice),
                }),
            });
            // Reset and close
            setFormData({ question: "", description: "", yesPrice: 0.5 });
            setIsOpen(false);
            alert("Market Created Successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to create market");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Plus className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">New Prediction Market</h2>
                </div>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-xs font-bold uppercase bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
                >
                    {isOpen ? "Cancel" : "Create New"}
                </button>
            </div>

            {isOpen && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question</label>
                        <input
                            required
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({...formData, question: e.target.value})}
                            className="w-full bg-black/50 border border-gray-800 rounded p-3 text-white focus:border-purple-500 outline-none transition-colors"
                            placeholder="e.g. Will BTC hit $100k?"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-black/50 border border-gray-800 rounded p-3 text-white focus:border-purple-500 outline-none transition-colors h-20"
                            placeholder="Add context for the market..."
                        />
                    </div>

                    <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Initial Odds (Yes: {Math.round(formData.yesPrice * 100)}%)
                        </label>
                        <input
                            type="range"
                            min="0.01"
                            max="0.99"
                            step="0.01"
                            value={formData.yesPrice}
                            onChange={(e) => setFormData({...formData, yesPrice: parseFloat(e.target.value)})}
                            className="w-full accent-purple-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-mono">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Deploy Market"}
                    </button>
                </form>
            )}
        </div>
    );
}
