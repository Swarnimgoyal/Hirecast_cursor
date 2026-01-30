import { NextResponse } from "next/server";
import { gameService } from "@/services/game.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const quests = await gameService.getActiveQuests();
    return NextResponse.json(quests);
}
