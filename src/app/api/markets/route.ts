import { NextResponse } from "next/server";
import { marketService } from "@/services/market.service";

export async function GET() {
    const markets = await marketService.getAllMarkets();
    return NextResponse.json(markets);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newMarket = await marketService.createMarket(body);
        return NextResponse.json(newMarket, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create market" }, { status: 500 });
    }
}
