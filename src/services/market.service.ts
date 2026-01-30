import { MarketAccount, UserPosition } from "@/types";

// Frontend-facing interface (derived from MarketAccount)
export interface MarketView extends MarketAccount {
    yesPrice: number;
    noPrice: number;
}

// In-Memory Database (Simulating On-Chain State)
const MARKETS_DB: MarketAccount[] = [
    {
        id: 1,
        question: "Will SOL reach $200 by end of 2026?",
        description: "Prediction market for Solana price action in the current cycle.",
        endDate: "2026-12-31",
        liquidityYes: 6500, // Implies 0.65 price
        liquidityNo: 3500,  // Implies 0.35 price
        volume: 1200000,
        resolved: false,
    },
    {
        id: 2,
        question: "Will Bitcoin hit $150k in Q1 2026?",
        description: "Bitcoin Q1 performance tracking.",
        endDate: "2026-03-31",
        liquidityYes: 4500,
        liquidityNo: 5500,
        volume: 900000,
        resolved: false,
    },
    {
        id: 3,
        question: "Will Ethereum exceed $5k before June?",
        description: "Ethereum price prediction.",
        endDate: "2026-06-01",
        liquidityYes: 3000,
        liquidityNo: 7000,
        volume: 500000,
        resolved: false,
    },
];

// Mock positions storage
const POSITIONS_DB: Record<string, UserPosition[]> = {};

export class MarketService {
    // Helper to calculate dynamic prices
    private calculatePrices(market: MarketAccount) {
        const total = market.liquidityYes + market.liquidityNo;
        // Avoid division by zero
        if (total === 0) return { yesPrice: 0.5, noPrice: 0.5 };
        return {
            yesPrice: market.liquidityYes / total,
            noPrice: market.liquidityNo / total,
        };
    }

    async getAllMarkets(): Promise<MarketView[]> {
        return MARKETS_DB.map(m => ({
            ...m,
            ...this.calculatePrices(m)
        }));
    }

    async getMarketById(id: number): Promise<MarketView | undefined> {
        const market = MARKETS_DB.find((m) => m.id === id);
        if (!market) return undefined;
        return {
            ...market,
            ...this.calculatePrices(market)
        };
    }

    // --- AMM LOGIC ---

    async updateLiquidity(marketId: number, outcome: "YES" | "NO", amount: number): Promise<MarketView> {
        const market = MARKETS_DB.find(m => m.id === marketId);
        if (!market) throw new Error("Market not found");

        if (outcome === "YES") {
            market.liquidityYes += amount;
        } else {
            market.liquidityNo += amount;
        }
        market.volume += amount;

        return {
            ...market,
            ...this.calculatePrices(market)
        };
    }

    async resolveMarket(marketId: number, winningOutcome: "YES" | "NO"): Promise<void> {
        const market = MARKETS_DB.find(m => m.id === marketId);
        if (!market) throw new Error("Market not found");

        market.resolved = true;
        market.winningOutcome = winningOutcome;
    }

    // --- POSITION LOGIC ---

    async getUserPositions(wallet: string): Promise<UserPosition[]> {
        return POSITIONS_DB[wallet] || [];
    }

    async updateUserPosition(wallet: string, marketId: number, outcome: "YES" | "NO", shares: number): Promise<void> {
        if (!POSITIONS_DB[wallet]) {
            POSITIONS_DB[wallet] = [];
        }

        const existing = POSITIONS_DB[wallet].find(p => p.marketId === marketId);
        if (existing) {
            if (outcome === "YES") existing.sharesYes += shares;
            else existing.sharesNo += shares;
        } else {
            POSITIONS_DB[wallet].push({
                wallet,
                marketId,
                sharesYes: outcome === "YES" ? shares : 0,
                sharesNo: outcome === "NO" ? shares : 0,
            });
        }
    }

    // --- SIMULATION ENGINE ---

    constructor() {
        // Start the Market Activity Simulator
        if (typeof setInterval !== 'undefined') {
            setInterval(() => this.simulateMarketActivity(), 3000); // Trade every 3s
        }
    }

    private simulateMarketActivity() {
        const marketToTrade = MARKETS_DB[Math.floor(Math.random() * MARKETS_DB.length)];
        const isYes = Math.random() > 0.5;
        const amount = Math.floor(Math.random() * 500) + 50; // $50 - $550 trade

        if (isYes) {
            marketToTrade.liquidityYes += amount;
        } else {
            marketToTrade.liquidityNo += amount;
        }
        marketToTrade.volume += amount;

        // Log for debug (server side)
        // console.log(`[SIM] Auto-trade: ${amount} on ${isYes ? 'YES' : 'NO'} for Market ${marketToTrade.id}`);
    }

    async createMarket(marketData: Partial<MarketAccount>): Promise<MarketView> {
        const newMarket: MarketAccount = {
            id: MARKETS_DB.length + 1,
            question: marketData.question || "Untitled Market",
            description: marketData.description || "",
            endDate: marketData.endDate || "2026-12-31",
            liquidityYes: marketData.liquidityYes || 5000,
            liquidityNo: marketData.liquidityNo || 5000,
            volume: 0,
            resolved: false,
        };
        MARKETS_DB.push(newMarket);
        return {
            ...newMarket,
            ...this.calculatePrices(newMarket)
        };
    }
}

export const marketService = new MarketService();
