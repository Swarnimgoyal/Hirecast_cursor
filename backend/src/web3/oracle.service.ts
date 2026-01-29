import { pnpAdapter } from "./index";
import { Market } from "./pnp.adapter";

export type ResolveMarketDTO = {
  marketId: string;
  winningOutcomeIndex: number;
  evidence: string;
};

export const OracleService = {
  resolveMarket(dto: ResolveMarketDTO): Market {
    return pnpAdapter.resolveMarket(dto);
  },
};

