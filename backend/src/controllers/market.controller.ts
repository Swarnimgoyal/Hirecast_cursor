import { Request, Response, NextFunction } from "express";
import { MarketService } from "../web3/market.service";

export const MarketController = {
  listMarkets(_req: Request, res: Response, next: NextFunction) {
    try {
      const markets = MarketService.listMarkets();
      res.json(markets);
    } catch (err) {
      next(err);
    }
  },

  getMarketById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const market = MarketService.getMarketById(id);
      if (!market) {
        return res.status(404).json({ message: "Market not found" });
      }
      res.json(market);
    } catch (err) {
      next(err);
    }
  },

  createMarket(req: Request, res: Response, next: NextFunction) {
    try {
      const { question, outcomes, endTime } = req.body;
      const market = MarketService.createMarket({
        question,
        outcomes,
        endTime,
      });
      res.status(201).json(market);
    } catch (err) {
      next(err);
    }
  },
};

