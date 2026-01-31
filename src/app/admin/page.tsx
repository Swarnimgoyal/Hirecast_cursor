"use client";

import { useWallet } from "@/components/WalletContextProvider";
import { useEffect, useState } from "react";
import { adminService, SystemHealth, LiveEvent, MarketInsight } from "@/services/admin.service";
import { Activity, ShieldAlert, Cpu, Radio, Network, AlertTriangle, CheckCircle, Database, Play, Zap, X } from "lucide-react";
import { CreateMarketSection } from "@/components/CreateMarketSection";

export default function AdminPage() {
    const { connected } = useWallet();
    const [health, setHealth] = useState<SystemHealth | null>(null);
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [insights, setInsights] = useState<MarketInsight[]>([]);
    
    // Simulation State
    const [simulating, setSimulating] = useState<number | null>(null); // Market ID being simulated
    const [simulationResult, setSimulationResult] = useState<{ engagement: number, risk: number } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Subscribe to live updates
        const unsubscribe = adminService.subscribe((data) => {
            setHealth({ ...data.health }); // Force new ref
            setEvents([...data.events]);
            setInsights([...data.insights]);
        });
        return unsubscribe;
    }, []);

    const runSimulation = async (marketId: number) => {
        setSimulating(marketId);
        setSimulationResult(null);
        const res = await adminService.simulateImpact(marketId, "REBALANCE");
        setSimulationResult(res);
    };

    const executeAction = async () => {
        setIsProcessing(true);
        await adminService.executeAction("FIX");
        setIsProcessing(false);
        setSimulating(null);
        setSimulationResult(null);
    };

    if (!health) return <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono">Initializing Neural Link...</div>;

    return (
        <div className="min-h-screen bg-black text-white font-mono selection:bg-blue-500/30 transition-colors duration-500">
            {/* Header */}
            <div className={`border-b backdrop-blur-md sticky top-0 z-50 transition-colors duration-500 ${health.status === "WARNING" ? "bg-red-900/20 border-red-900/50" : "bg-gray-900/50 border-gray-800"}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-lg animate-pulse ${health.status === "WARNING" ? "bg-red-500/20 text-red-500" : "bg-blue-500/10 text-blue-400"}`}>
                            <Cpu className="w-6 h-6" />
                         </div>
                         <h1 className="text-xl font-bold tracking-wider uppercase">
                            Ops AI <span className="text-gray-600">|</span> 
                            <span className={health.status === "WARNING" ? "text-red-500" : "text-blue-400"}>
                                {health.status === "WARNING" ? " THREAT DETECTED" : " CONTROL ROOM"}
                            </span>
                         </h1>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <div className="flex items-center gap-2">
                             <span className={`w-2 h-2 rounded-full animate-ping ${health.status === "WARNING" ? "bg-red-500" : "bg-green-500"}`}></span>
                            {health.status === "WARNING" ? "DEFCON 3" : "SYSTEM ONLINE"}
                        </div>
                        <div className="uppercase">Block: {Math.floor(Date.now() / 1000)}</div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Col: Live Feed (The "Matrix" Stream) */}
                <div className="lg:col-span-1 border-r border-gray-800 pr-8 h-[calc(100vh-140px)] overflow-y-auto scrollbar-hide">
                    <h2 className="text-gray-500 font-bold uppercase text-xs mb-6 flex items-center gap-2">
                        <Radio className="w-4 h-4" /> Live SDK Data Stream
                    </h2>
                    <div className="space-y-3">
                        {events.map((event) => (
                            <div key={event.id} className="p-3 bg-gray-900/20 border border-gray-800/50 rounded-lg text-xs animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="flex justify-between text-gray-600 mb-1">
                                    <span className={event.type === "RISK_ALERT" ? "text-red-500 font-bold" : ""}>{event.type}</span>
                                    <span>{event.timestamp}</span>
                                </div>
                                <div className="text-gray-400 font-mono">
                                    <span className="text-gray-500">&gt; </span> {event.details}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Dashboard */}
                <div className="lg:col-span-3 space-y-8 relative">
                    
                    {/* 1. Health Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-full text-blue-400">
                                <Network className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">Active Nodes</p>
                                <p className="text-2xl font-bold">{health.activeUsers}</p>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-xl flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">24h Volume</p>
                                <p className="text-2xl font-bold text-green-400">${health.transactionVolume.toLocaleString()}</p>
                            </div>
                        </div>
                         <div className={`p-6 border rounded-xl flex items-center gap-4 transition-colors ${health.status === "WARNING" ? "bg-red-900/20 border-red-500 animate-pulse" : "bg-gray-900/30 border-gray-800"}`}>
                            <div className={`p-3 rounded-full ${health.status === "WARNING" ? "bg-red-500 text-white" : "bg-red-500/10 text-red-400"}`}>
                                <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">Risk Flags</p>
                                <p className={`text-2xl font-bold ${health.status === "WARNING" ? "text-red-500" : "text-gray-400"}`}>{health.suspiciousActivity}</p>
                            </div>
                        </div>
                    </div>

                   {/* 1.5 Create Market Section */}
                   <CreateMarketSection />

                    {/* 2. AI Market Intelligence */}
                    <div>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                             <Activity className="w-5 h-5 text-purple-400" />
                             AI Market Intelligence
                        </h2>
                        <div className="grid gap-4">
                            {insights.map((qt) => (
                                <div key={qt.marketId} className={`bg-gray-900 border rounded-xl p-6 flex flex-col md:flex-row justify-between gap-6 transition-all ${qt.volatility === "HIGH" ? "border-purple-500/50 shadow-lg shadow-purple-900/20" : "border-gray-800"}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-bold text-lg">{qt.title}</h3>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${qt.volatility === "HIGH" ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>
                                                {qt.volatility} VOLATILITY
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                                            <div className="bg-purple-500 h-full" style={{ width: `${qt.sentiment}%` }}></div>
                                        </div>
                                        <p className="text-xs text-gray-400">Crowd Sentiment: {qt.sentiment}% Bullish</p>
                                    </div>
                                    
                                    <div className="md:w-1/3 bg-black/30 p-4 rounded-lg border border-gray-800/50 relative overflow-hidden">
                                        
                                        {/* Normal State */}
                                        {simulating !== qt.marketId && (
                                            <>
                                                <h4 className="text-purple-400 text-xs font-bold uppercase mb-2 flex items-center gap-1">
                                                    <Cpu className="w-3 h-3" /> AI Recommendation
                                                </h4>
                                                <p className="text-sm text-gray-300 leading-snug mb-3">
                                                    {qt.aiRecommendation}
                                                </p>
                                                {qt.volatility === "HIGH" && (
                                                    <button 
                                                        onClick={() => runSimulation(qt.marketId)}
                                                        className="w-full py-2 bg-purple-600/20 text-purple-400 border border-purple-500/50 rounded hover:bg-purple-600/30 transition-colors text-xs font-bold uppercase flex items-center justify-center gap-2"
                                                    >
                                                        <Zap className="w-3 h-3" />
                                                        Simulate Intervention
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* Simulation State */}
                                        {simulating === qt.marketId && (
                                            <div className="absolute inset-0 bg-gray-900 p-4 flex flex-col justify-center animate-in fade-in zoom-in-95">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-white text-xs font-bold uppercase">Simulation Mode</h4>
                                                    <button onClick={() => setSimulating(null)}><X className="w-4 h-4 text-gray-500" /></button>
                                                </div>
                                                
                                                {!simulationResult ? (
                                                    <div className="flex flex-col items-center justify-center py-2 text-purple-400">
                                                        <Activity className="w-6 h-6 animate-spin mb-2" />
                                                        <span className="text-xs">Running Predictive Models...</span>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="grid grid-cols-2 gap-2 text-center">
                                                            <div className="bg-green-900/20 p-2 rounded">
                                                                <div className="text-green-400 font-bold">+{simulationResult.engagement}%</div>
                                                                <div className="text-[10px] text-gray-400">ENGAGEMENT</div>
                                                            </div>
                                                            <div className="bg-red-900/20 p-2 rounded">
                                                                <div className="text-red-400 font-bold">{simulationResult.risk > 0 ? "+" : ""}{simulationResult.risk}%</div>
                                                                <div className="text-[10px] text-gray-400">RISK FACTOR</div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={executeAction}
                                                            disabled={isProcessing}
                                                            className="w-full py-2 bg-green-500 text-black font-bold text-xs uppercase rounded flex items-center justify-center gap-2 hover:bg-green-400"
                                                        >
                                                            {isProcessing ? <Activity className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                                            {isProcessing ? "Executing on Chain..." : "Confirm & Execute"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
