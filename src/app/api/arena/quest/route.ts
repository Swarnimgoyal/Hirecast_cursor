import { NextResponse } from "next/server";
import { arenaService } from "@/services/arena.service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const quest = await arenaService.getDailyQuest();
    return NextResponse.json(quest);
}
