// PNPAdapter simulates a blockchain-based prediction market engine.
// It owns the in-memory state and exposes a simple interface that
// can later be backed by a real SDK without changing callers.

export type OutcomeState = {
  name: string;
  liquidity: number;
  probability: number;
};

export type Market = {
  id: string;
  question: string;
  outcomes: OutcomeState[];
  endTime: number;
  createdAt: number;
  resolved: boolean;
  winningOutcomeIndex: number | null;
  evidence: string | null;
};

export type Trade = {
  id: string;
  marketId: string;
  outcomeIndex: number;
  amount: number;
  timestamp: number;
  // Wallet address placing the trade (if provided by frontend).
  walletAddress?: string;
};

type CreateMarketInput = {
  question: string;
  outcomes: string[];
  endTime: number;
};

type TradeInput = {
  marketId: string;
  outcomeIndex: number;
  amount: number;
  // Optional wallet address so we can associate trades with users.
  walletAddress?: string;
};

type ResolveMarketInput = {
  marketId: string;
  winningOutcomeIndex: number;
  evidence: string;
};

export class PNPAdapter {
  private markets: Map<string, Market> = new Map();
  private trades: Trade[] = [];
  private nextMarketId = 1;
  private nextTradeId = 1;

  // Equal initial liquidity that induces equal probabilities.
  private readonly initialLiquidityPerOutcome = 100;

  getAllMarkets(): Market[] {
    return Array.from(this.markets.values());
  }

  getMarketById(id: string): Market | undefined {
    return this.markets.get(id);
  }

  getTradesForMarket(marketId: string): Trade[] {
    return this.trades.filter((t) => t.marketId === marketId);
  }

  createMarket(input: CreateMarketInput): Market {
    if (!input.question || !input.outcomes || input.outcomes.length < 2) {
      throw new Error("Market must have a question and at least two outcomes.");
    }

    const id = String(this.nextMarketId++);
    const createdAt = Date.now();

    const outcomes: OutcomeState[] = input.outcomes.map((name) => ({
      name,
      liquidity: this.initialLiquidityPerOutcome,
      // temporary, we normalize below
      probability: 0,
    }));

    this.normalizeProbabilities(outcomes);

    const market: Market = {
      id,
      question: input.question,
      outcomes,
      endTime: input.endTime,
      createdAt,
      resolved: false,
      winningOutcomeIndex: null,
      evidence: null,
    };

    this.markets.set(id, market);
    return market;
  }

  trade(input: TradeInput): { market: Market; trade: Trade } {
    const market = this.markets.get(input.marketId);
    if (!market) {
      throw new Error("Market not found");
    }
    if (market.resolved) {
      throw new Error("Market is already resolved");
    }
    if (input.outcomeIndex < 0 || input.outcomeIndex >= market.outcomes.length) {
      throw new Error("Invalid outcome index");
    }
    if (input.amount <= 0) {
      throw new Error("Trade amount must be positive");
    }

    // Simple AMM-style update: treat amount as additional liquidity
    // for the chosen outcome. Probabilities are just normalized
    // liquidity shares.
    const outcome = market.outcomes[input.outcomeIndex];
    outcome.liquidity += input.amount;

    this.normalizeProbabilities(market.outcomes);

    const trade: Trade = {
      id: String(this.nextTradeId++),
      marketId: market.id,
      outcomeIndex: input.outcomeIndex,
      amount: input.amount,
      timestamp: Date.now(),
      walletAddress: input.walletAddress,
    };
    this.trades.push(trade);

    this.markets.set(market.id, market);

    return { market, trade };
  }

  resolveMarket(input: ResolveMarketInput): Market {
    const market = this.markets.get(input.marketId);
    if (!market) {
      throw new Error("Market not found");
    }
    if (market.resolved) {
      throw new Error("Market is already resolved");
    }
    if (
      input.winningOutcomeIndex < 0 ||
      input.winningOutcomeIndex >= market.outcomes.length
    ) {
      throw new Error("Invalid winning outcome index");
    }

    market.resolved = true;
    market.winningOutcomeIndex = input.winningOutcomeIndex;
    market.evidence = input.evidence;

    this.markets.set(market.id, market);
    return market;
  }

  // Utility to ensure probabilities always sum to 1.
  private normalizeProbabilities(outcomes: OutcomeState[]): void {
    const totalLiquidity = outcomes.reduce(
      (sum, o) => sum + o.liquidity,
      0
    );
    outcomes.forEach((o) => {
      o.probability =
        totalLiquidity > 0 ? o.liquidity / totalLiquidity : 1 / outcomes.length;
    });
  }
}

