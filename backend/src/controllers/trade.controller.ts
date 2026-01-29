import { Request, Response, NextFunction } from "express";
import { TradeService } from "../web3/trade.service";

export const TradeController = {
  placeTrade(req: Request, res: Response, next: NextFunction) {
    try {
      const { marketId, outcomeIndex, amount } = req.body;
      const { market, trade } = TradeService.placeTrade({
        marketId,
        outcomeIndex: Number(outcomeIndex),
        amount: Number(amount),
      });
      res.status(201).json({ market, trade });
    } catch (err) {
      next(err);
    }
  },
};

