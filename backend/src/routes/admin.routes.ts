import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = Router();

router.post("/resolve", adminMiddleware, AdminController.resolveMarket);

export default router;

