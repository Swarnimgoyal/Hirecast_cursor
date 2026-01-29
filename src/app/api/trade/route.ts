import { NextResponse } from "next/server";
import { tradeService } from "@/services/trade.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = await tradeService.executeTrade(body);

        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Trade execution failed" }, { status: 500 });
    }
}
