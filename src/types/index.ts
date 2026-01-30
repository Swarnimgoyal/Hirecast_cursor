// Phantom Provider Types
export interface PhantomProvider {
    isPhantom: boolean;
    connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
    disconnect: () => Promise<void>;
    on: (event: string, callback: (args: any) => void) => void;
    request: (method: string, params: any) => Promise<any>;
    signTransaction: (transaction: any) => Promise<any>;
    signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
}

declare global {
    interface Window {
        solana?: PhantomProvider;
    }
}

//// Gamification Types
export interface UserStats {
    wallet: string;
    xp: number;
    level: number;
    streak: number;
    completedQuests: number;
    badges: string[];
}

export interface Quest {
    id: number;
    title: string;
    description: string;
    rewardXp: number;
    marketId: number; // Links to the financial market
    status: "ACTIVE" | "COMPLETED" | "LOCKED";
    expiresIn: string; // "2h 30m"
}

export interface MarketAccount {
    id: number;
    question: string;
    description: string;
    endDate: string;

    // AMM State
    liquidityYes: number;
    liquidityNo: number;
    volume: number;

    // Status
    resolved: boolean;
    winningOutcome?: "YES" | "NO";
}

export interface UserPosition {
    wallet: string; // PublicKey string
    marketId: number;
    sharesYes: number;
    sharesNo: number;
}

export interface TradeEvent {
    id: string;
    marketId: number;
    trader: string;
    outcome: "YES" | "NO";
    amount: number;
    price: number;
    timestamp: number;
}
