import { Router } from "express";
import { MarketController } from "../controllers/market.controller";

const router = Router();

router.get("/", MarketController.listMarkets);
router.get("/:id", MarketController.getMarketById);
router.post("/", MarketController.createMarket);

export default router;

