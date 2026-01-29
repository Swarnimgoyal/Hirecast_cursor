export class OracleService {
    // Simulates checking an external price feed (e.g. Pyth or Chainlink)
    async getAssetPrice(asset: string): Promise<number> {
        // Mock prices for demo
        const prices: Record<string, number> = {
            "SOL": 145.50,
            "BTC": 95000.00,
            "ETH": 3500.00
        };
        return prices[asset] || 0;
    }

    async resolveMarket(marketId: number): Promise<"YES" | "NO" | "PENDING"> {
        // Mock resolution logic
        return "PENDING";
    }
}

export const oracleService = new OracleService();
