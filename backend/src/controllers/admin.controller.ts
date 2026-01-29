import { Request, Response, NextFunction } from "express";
import { OracleService } from "../web3/oracle.service";

export const AdminController = {
  resolveMarket(req: Request, res: Response, next: NextFunction) {
    try {
      const { marketId, winningOutcomeIndex, evidence } = req.body;
      const market = OracleService.resolveMarket({
        marketId,
        winningOutcomeIndex: Number(winningOutcomeIndex),
        evidence,
      });
      res.json(market);
    } catch (err) {
      next(err);
    }
  },
};

