export interface Market {
    id: number;
    question: string;
    yesPrice: number;
    noPrice: number;
    volume: string;
    description?: string;
    endDate?: string;
}

// Mock Database
const MARKETS_DB: Market[] = [
    {
        id: 1,
        question: "Will SOL reach $200 by end of 2026?",
        yesPrice: 0.65,
        noPrice: 0.35,
        volume: "$1.2M",
        description: "Prediction market for Solana price action in the current cycle.",
        endDate: "2026-12-31",
    },
    {
        id: 2,
        question: "Will Bitcoin hit $150k in Q1 2026?",
        yesPrice: 0.45,
        noPrice: 0.55,
        volume: "$900K",
        description: "Bitcoin Q1 performance tracking.",
        endDate: "2026-03-31",
    },
    {
        id: 3,
        question: "Will Ethereum exceed $5k before June?",
        yesPrice: 0.30,
        noPrice: 0.70,
        volume: "$500K",
        endDate: "2026-06-01",
    },
];

export class MarketService {
    async getAllMarkets(): Promise<Market[]> {
        // Simulate DB delay
        return MARKETS_DB;
    }

    async getMarketById(id: number): Promise<Market | undefined> {
        return MARKETS_DB.find((m) => m.id === id);
    }

    async createMarket(market: Omit<Market, "id">): Promise<Market> {
        const newMarket = {
            ...market,
            id: MARKETS_DB.length + 1,
        };
        MARKETS_DB.push(newMarket);
        return newMarket;
    }
}

export const marketService = new MarketService();
