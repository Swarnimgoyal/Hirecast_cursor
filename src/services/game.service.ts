import { UserStats, Quest } from "@/types";

// Mock Database
const USER_STATS_DB: Record<string, UserStats> = {};
// Mutable DB
const QUESTS_DB: Quest[] = [
    {
        id: 1,
        title: "Daily Predictor: Google Internships",
        description: "Will Google visit IIITV for internships this year?",
        rewardXp: 100,
        marketId: 1,
        status: "ACTIVE",
        expiresIn: "4 Hours"
    },
    {
        id: 2,
        title: "Crypto Whale Challenge",
        description: "Will SOL break $200 this week?",
        rewardXp: 250,
        marketId: 2,
        status: "ACTIVE",
        expiresIn: "1 Day"
    },
    {
        id: 3,
        title: "Tech Trend: AI Takeover",
        description: "Will OpenAI release GPT-5 before Q3?",
        rewardXp: 150,
        marketId: 3,
        status: "LOCKED",
        expiresIn: "Coming Soon"
    }
];

export class GameService {
    constructor() {
        if (typeof setInterval !== 'undefined') {
            setInterval(() => this.simulateGameWorld(), 5000);
        }
    }

    private simulateGameWorld() {
        // Randomly change "Expires In" to simulate time passing
        QUESTS_DB.forEach(q => {
            if (q.status === "ACTIVE") {
                const hours = Math.floor(Math.random() * 24);
                q.expiresIn = `${hours} Hours`;

                // Randomly complete a quest for a random user (simulated)
                if (Math.random() > 0.8) {
                    // console.log(`[SIM] Quest ${q.id} trending with high activity`);
                }
            }
        });
    }

    async getUserStats(wallet: string): Promise<UserStats> {
        if (!USER_STATS_DB[wallet]) {
            // Initialize new user
            USER_STATS_DB[wallet] = {
                wallet,
                xp: 0,
                level: 1,
                streak: 0,
                completedQuests: 0,
                badges: []
            };
        }
        return USER_STATS_DB[wallet];
    }

    async getActiveQuests(): Promise<Quest[]> {
        return QUESTS_DB;
    }

    async completeQuest(wallet: string, questId: number): Promise<{ newXp: number, leveledUp: boolean }> {
        const stats = await this.getUserStats(wallet);
        const quest = QUESTS_DB.find(q => q.id === questId);

        if (!quest) throw new Error("Quest not found");

        const previousLevel = stats.level;

        // Update Stats
        stats.xp += quest.rewardXp;
        stats.completedQuests += 1;
        stats.streak += 1; // Simplified streak logic

        // Level Up Logic (Simple: Level = XP / 1000)
        stats.level = Math.floor(stats.xp / 1000) + 1;

        return {
            newXp: stats.xp,
            leveledUp: stats.level > previousLevel
        };
    }

    async getLeaderboard(): Promise<UserStats[]> {
        return Object.values(USER_STATS_DB).sort((a, b) => b.xp - a.xp).slice(0, 10);
    }
}

export const gameService = new GameService();
