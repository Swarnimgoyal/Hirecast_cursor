import express from "express";
import cors from "cors";

import marketRoutes from "./routes/market.routes";
import tradeRoutes from "./routes/trade.routes";
import adminRoutes from "./routes/admin.routes";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/markets", marketRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorMiddleware);

export default app;

