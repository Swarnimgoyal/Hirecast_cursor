export interface SystemHealth {
    status: "NORMAL" | "WARNING" | "CRITICAL";
    activeUsers: number;
    transactionVolume: number; // in USDC
    suspiciousActivity: number; // Count of flagged events
}

export interface LiveEvent {
    id: string;
    type: "CONNECT" | "PREDICT" | "QUEST_COMPLETE" | "RISK_ALERT" | "BLOCK_CONFIRM";
    user: string;
    details: string;
    timestamp: string;
}

export interface MarketInsight {
    marketId: number;
    title: string;
    sentiment: number; // 0-100
    volatility: "LOW" | "MEDIUM" | "HIGH";
    aiRecommendation: string;
    impactPrediction?: {
        engagement: number; // % change
        risk: number; // % change
    };
}

export type AdminListener = (data: { health: SystemHealth, events: LiveEvent[], insights: MarketInsight[] }) => void;

class AdminService {
    private health: SystemHealth = {
        status: "NORMAL",
        activeUsers: 124,
        transactionVolume: 45200,
        suspiciousActivity: 0
    };

    private events: LiveEvent[] = [];
    private insights: MarketInsight[] = [
        {
            marketId: 1,
            title: "Google Internships",
            sentiment: 85,
            volatility: "LOW",
            aiRecommendation: "Market Balanced"
        },
        {
            marketId: 2,
            title: "SOL Price > $200",
            sentiment: 92,
            volatility: "HIGH",
            aiRecommendation: "⚠️ Crowd Imbalance. Recommend Rebalancing."
        }
    ];

    private listeners: AdminListener[] = [];
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        // Initial seed
        this.addEvent({
            id: "0", type: "BLOCK_CONFIRM", user: "Solana",
            details: "Block #245019 Finalized", timestamp: "Now"
        });
    }

    subscribe(listener: AdminListener) {
        this.listeners.push(listener);
        // Send immediate state
        listener({ health: this.health, events: this.events, insights: this.insights });

        // Start simulation if not running
        if (!this.intervalId) {
            this.startSimulation();
        }

        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
            if (this.listeners.length === 0) {
                this.stopSimulation();
            }
        };
    }

    private startSimulation() {
        this.intervalId = setInterval(() => {
            this.tick();
        }, 3000); // Update every 3 seconds
    }

    private stopSimulation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private tick() {
        // 1. Simulate Traffic
        if (Math.random() > 0.3) {
            this.health.activeUsers += Math.floor(Math.random() * 5) - 2; // Fluctuate
            this.health.transactionVolume += Math.floor(Math.random() * 500);
        }

        // 2. Random Events
        const rand = Math.random();
        if (rand > 0.7) {
            this.addEvent(this.generateRandomEvent());
        }

        // 3. Update Risk State
        if (rand > 0.95 && this.health.status === "NORMAL") {
            this.health.status = "WARNING";
            this.health.suspiciousActivity += 1;
            this.addEvent({
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: "RISK_ALERT",
                user: "System",
                details: "Abnormal trading volume detected in pool #2",
                timestamp: "Just now"
            });
            // Update Insight
            this.insights[1].aiRecommendation = "🚨 CRITICAL: Bot Attack Detected. FREEZE MARKET?";
        }

        this.notify();
    }

    private addEvent(event: LiveEvent) {
        this.events = [event, ...this.events].slice(0, 20); // Keep last 20
    }

    private notify() {
        this.listeners.forEach(l => l({ health: this.health, events: this.events, insights: this.insights }));
    }

    private generateRandomEvent(): LiveEvent {
        const types: LiveEvent["type"][] = ["CONNECT", "PREDICT", "QUEST_COMPLETE", "BLOCK_CONFIRM"];
        const users = ["Gv1p...8Z6t", "mvines...9zYt", "Be7C...347e", "NewUser_01"];
        const actions = ["Connected Wallet", "Placed 20 USDC Bet", "Completed Daily Quest", "Verified Block"];

        const type = types[Math.floor(Math.random() * types.length)];
        return {
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            user: type === "BLOCK_CONFIRM" ? "Solana Mainnet" : users[Math.floor(Math.random() * users.length)],
            details: type === "BLOCK_CONFIRM" ? `Block finalized in 400ms` : actions[Math.floor(Math.random() * actions.length)],
            timestamp: "Just now"
        };
    }

    // --- Simulation Mode ---
    async simulateImpact(marketId: number, adjustment: string): Promise<{ engagement: number, risk: number }> {
        // Mock calculation
        await new Promise(r => setTimeout(r, 1500)); // Fake processing delay
        return {
            engagement: Math.floor(Math.random() * 20) + 5, // +5 to +25%
            risk: Math.floor(Math.random() * 10) - 5 // -5 to +5%
        };
    }

    async executeAction(action: string) {
        // Mock chain execution
        await new Promise(r => setTimeout(r, 2000));

        // Fix issues if any
        if (this.health.status === "WARNING") {
            this.health.status = "NORMAL";
            this.health.suspiciousActivity = 0;
            this.events.unshift({
                id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: "RISK_ALERT",
                user: "Admin",
                details: "Threat mitigated. Market re-enabled.",
                timestamp: "Just now"
            });
            this.insights[1].aiRecommendation = "Market Balanced";
        }

        this.notify();
    }
}

export const adminService = new AdminService();
