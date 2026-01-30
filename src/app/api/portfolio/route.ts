import { NextResponse } from "next/server";
import { marketService } from "@/services/market.service";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
        return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    try {
        const positions = await marketService.getUserPositions(wallet);

        // Enrich positions with current market data (to show current value)
        const enrichedPositions = await Promise.all(positions.map(async (pos) => {
            const market = await marketService.getMarketById(pos.marketId);
            return {
                ...pos,
                marketQuestion: market?.question || "Unknown Market",
                currentYesPrice: market?.yesPrice || 0,
                currentNoPrice: market?.noPrice || 0,
            };
        }));

        return NextResponse.json(enrichedPositions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
    }
}
