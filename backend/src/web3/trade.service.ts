import { pnpAdapter } from "./index";
import { Market, Trade } from "./pnp.adapter";

export type TradeDTO = {
  marketId: string;
  outcomeIndex: number;
  amount: number;
  walletAddress?: string;
};

export const TradeService = {
  placeTrade(dto: TradeDTO): { market: Market; trade: Trade } {
    return pnpAdapter.trade(dto);
  },
};

