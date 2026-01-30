import { pnpAdapter } from "@/lib/adapter/pnp.adapter";
import { marketService } from "./market.service";
import { TradeEvent } from "@/types";

export interface TradeRequest {
    marketId: number;
    side: "YES" | "NO";
    amount: number;
    userAddress: string;
    isPrivate: boolean;
    txHash?: string;
}

export interface TradeResult {
    success: boolean;
    txHash?: string;
    message: string;
    newPriceYes?: number;
    newPriceNo?: number;
}

// Mock Event Log
const EVENT_LOG: TradeEvent[] = [];

export class TradeService {
    async executeTrade(trade: TradeRequest): Promise<TradeResult> {
        // 1. Validate Address
        if (!pnpAdapter.isValidAddress(trade.userAddress)) {
            return { success: false, message: "Invalid wallet address" };
        }

        // 2. Validate Market
        const market = await marketService.getMarketById(trade.marketId);
        if (!market) {
            return { success: false, message: "Market not found" };
        }
        if (market.resolved) {
            return { success: false, message: "Market is already resolved" };
        }

        // 3. AMM Execution (Update Liquidity)
        // In simulation: User 'sends' SOL to the pool.
        // We update the pool liquidity immediately.
        const updatedMarket = await marketService.updateLiquidity(trade.marketId, trade.side, trade.amount);

        // 4. Mint Outcome Tokens (Track Position)
        // Strategy: 1 SOL bet = 1 SHARE of that outcome.
        const shares = trade.amount;
        await marketService.updateUserPosition(trade.userAddress, trade.marketId, trade.side, shares);

        // 5. Generate Trade Event
        const event: TradeEvent = {
            id: Math.random().toString(36).substring(7),
            marketId: trade.marketId,
            trader: trade.userAddress,
            outcome: trade.side,
            amount: trade.amount,
            price: trade.side === "YES" ? updatedMarket.yesPrice : updatedMarket.noPrice,
            timestamp: Date.now(),
        };
        EVENT_LOG.push(event);

        // 6. Return Result
        console.log(`[TRADE] Wallet ${trade.userAddress} bought ${trade.amount} ${trade.side} on Market ${trade.marketId}`);

        // Handle Privacy Track or Real Transaction
        let finalTxHash = trade.txHash;

        if (!finalTxHash) {
            // Fallback for simulation/privacy if no hash provided
            finalTxHash = "solana_tx_" + Math.random().toString(36).substring(7);
            if (trade.isPrivate) {
                console.log(`[PRIVACY] Shielded transaction log for ${trade.userAddress}`);
                finalTxHash = "confidential_tx_" + Math.random().toString(36).substring(7);
            }
        }

        return {
            success: true,
            txHash: finalTxHash,
            message: `Successfully bought ${trade.amount} ${trade.side} shares`,
            newPriceYes: updatedMarket.yesPrice,
            newPriceNo: updatedMarket.noPrice,
        };
    }

    async getTradeHistory(marketId: number): Promise<TradeEvent[]> {
        return EVENT_LOG.filter(e => e.marketId === marketId).sort((a, b) => b.timestamp - a.timestamp);
    }
}

export const tradeService = new TradeService();
