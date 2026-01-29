import { PNPAdapter } from "./pnp.adapter";

// Single shared instance of the adapter used by all services.
export const pnpAdapter = new PNPAdapter();

// Seed a simple example market for testing.
// This runs once on adapter initialization.
if (pnpAdapter.getAllMarkets().length === 0) {
  pnpAdapter.createMarket({
    question: "Will Solana flip Ethereum in market cap by 2030?",
    outcomes: ["Yes", "No"],
    endTime: Date.now() + 1000 * 60 * 60 * 24 * 30, // ~30 days
  });
}

