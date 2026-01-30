import { UserStats } from "@/types";

export interface ArenaProfile {
    wallet: string;
    dna: {
        contrarian: number; // 0-100
        riskTaker: number;
        trendFollower: number;
        oracle: number; // Accuracy
    };
    badges: string[];
}

export interface ArenaQuest {
    id: number;
    title: string;
    context: string;
    marketId: number;
    crowdSentiment: number; // Actual current crowd % (hidden)
}

// Mutable DB
const CURRENT_QUEST: ArenaQuest = {
    id: 101,
    title: "The AI Singularity Event",
    context: "DeepSeek just outperformed GPT-4. Will OpenAI respond with a new model launch within 48 hours?",
    marketId: 1,
    crowdSentiment: 78
};

const ARENA_PROFILES: Record<string, ArenaProfile> = {};

export class ArenaService {
    constructor() {
        if (typeof setInterval !== 'undefined') {
            setInterval(() => this.simulateCrowd(), 2000); // 2s Tick
        }
    }

    private simulateCrowd() {
        // Fluctuate Sentiment
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        let newSentiment = CURRENT_QUEST.crowdSentiment + change;

        // Clamp 0-100
        if (newSentiment > 99) newSentiment = 99;
        if (newSentiment < 1) newSentiment = 1;

        CURRENT_QUEST.crowdSentiment = newSentiment;
    }

    async getProfile(wallet: string): Promise<ArenaProfile> {
        if (!ARENA_PROFILES[wallet]) {
            ARENA_PROFILES[wallet] = {
                wallet,
                dna: {
                    contrarian: 20,
                    riskTaker: 50,
                    trendFollower: 60,
                    oracle: 0
                },
                badges: ["Arena Rookie"]
            };
        }
        return ARENA_PROFILES[wallet];
    }

    async getDailyQuest(): Promise<ArenaQuest> {
        return CURRENT_QUEST;
    }

    async submitPrediction(wallet: string, questId: number, crowdGuess: number) {
        // In a real app, storing this guess to compare later
        console.log(`[ARENA] ${wallet} predicts crowd at ${crowdGuess}% for quest ${questId}`);
        // Simulate DNA update
        const profile = await this.getProfile(wallet);
        profile.dna.riskTaker += 5;
        // Also impact market sentiment slightly
        CURRENT_QUEST.crowdSentiment += (crowdGuess > 50 ? 0.1 : -0.1);

        return profile;
    }
}

export const arenaService = new ArenaService();
