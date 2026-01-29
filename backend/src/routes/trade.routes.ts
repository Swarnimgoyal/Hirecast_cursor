import { Router } from "express";
import { TradeController } from "../controllers/trade.controller";

const router = Router();

router.post("/", TradeController.placeTrade);

export default router;

