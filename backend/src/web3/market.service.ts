import { pnpAdapter } from "./index";
import { Market } from "./pnp.adapter";

export type CreateMarketDTO = {
  question: string;
  outcomes: string[];
  endTime: number;
};

export const MarketService = {
  listMarkets(): Market[] {
    return pnpAdapter.getAllMarkets();
  },

  getMarketById(id: string): Market | undefined {
    return pnpAdapter.getMarketById(id);
  },

  createMarket(dto: CreateMarketDTO): Market {
    return pnpAdapter.createMarket(dto);
  },
};

