import { NextResponse } from "next/server";
import { UserStats } from "@/types";

// In-Memory Database (Resets on server restart)
// Pre-seeded with some "Pro" users so it looks lively
let LEADERBOARD_DB: UserStats[] = [
    { wallet: "Gv1p...8Z6t", xp: 15400, level: 15, streak: 12, completedQuests: 45, badges: ["Oracle", "Risk Taker"] },
    { wallet: "mvines...9zYt", xp: 12200, level: 12, streak: 5, completedQuests: 38, badges: ["Trend Follower"] },
    { wallet: "Be7C...347e", xp: 9800, level: 9, streak: 8, completedQuests: 21, badges: ["Rookie"] },
    { wallet: "GrAk...15h3", xp: 8500, level: 8, streak: 2, completedQuests: 19, badges: [] },
    { wallet: "9WzD...AWWM", xp: 4200, level: 4, streak: 0, completedQuests: 10, badges: [] },
];

export async function GET() {
    // Return sorted by XP
    const sorted = [...LEADERBOARD_DB].sort((a, b) => b.xp - a.xp);
    return NextResponse.json(sorted);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { wallet, action } = body;

        if (!wallet) return NextResponse.json({ error: "Wallet required" }, { status: 400 });

        let userIndex = LEADERBOARD_DB.findIndex(u => u.wallet === wallet);
        let user: UserStats;

        if (userIndex === -1) {
            // New User
            user = {
                wallet,
                xp: 0,
                level: 1,
                streak: 1,
                completedQuests: 0,
                badges: ["Newbie"]
            };
            LEADERBOARD_DB.push(user);
        } else {
            user = LEADERBOARD_DB[userIndex];
        }

        // Apply Updates based on Action
        if (action === "QUEST_COMPLETE") {
            user.xp += 100;
            user.completedQuests += 1;
            user.streak += 1; // Simplified streak logic
        } else if (action === "ARENA_WIN") {
            user.xp += 500;
            user.badges.push("Arena Winner");
        }

        // Recalculate Level
        user.level = Math.floor(user.xp / 1000) + 1;

        return NextResponse.json({ success: true, user });

    } catch (e) {
        return NextResponse.json({ error: "Failed to update leaderboard" }, { status: 500 });
    }
}
