# NEXUS – The Future of Decentralized Prediction Markets

> **Live on Solana Devnet** 🚀

NEXUS is a gamified, decentralized prediction market platform where users can trade on the outcomes of real-world events (News, Crypto, Culture) and compete in **The Arena** to test their crowd-sentiment prediction skills.

The platform combines **on-chain execution**, **AMM-based pricing**, and **game mechanics** to create an engaging and transparent prediction experience.

---

## 🌟 Key Features

### 1. Dynamic Prediction Markets
Trade on event outcomes by buying **Yes / No** shares.

- **AMM-based pricing**: Prices adjust dynamically based on liquidity and demand.
- **Instant trades**: Sub-second confirmations on Solana Devnet.
- **Portfolio tracking**: Live PnL and position visibility.

---

### 2. The Arena (Experimental)
A two-layer prediction challenge designed to test both intuition and conviction.

- **Crowd Sentiment Prediction**: Predict how the majority will vote.
- **Reality Bet**: Stake capital on what you believe will actually happen.
- **Rewards**: XP, badges, and detailed prediction performance analytics.

---

### 3. Gamification Layer
- **Quests**: Daily challenges to boost engagement.
- **Leaderboards**: Global rankings of top predictors.
- **Badges**: Titles like *Oracle*, *Contrarian*, and *Risk Taker*.

---

## 🏗️ Architecture Overview

NEXUS follows a **User → Wallet → Application → Blockchain → Verification** flow.

### High-Level Components
- **Frontend**: Next.js + React UI
- **Wallets**: Phantom / Solflare
- **Web3 Adapter (PNP)**: Transaction abstraction & verification layer
- **Blockchain**: Solana Devnet
- **Market Service**: Off-chain state sync after on-chain confirmation

---

### Step-by-Step Flow

1. **User Action**  
   User clicks **“Buy Yes”** on a prediction market.

2. **Transaction Creation**  
   The frontend requests the **PNP Web3 Adapter** to construct an unsigned Solana transaction.

3. **Wallet Signature**  
   The transaction is sent to the user’s wallet (Phantom / Solflare) for signing.

4. **On-Chain Submission**  
   The signed transaction is submitted to **Solana Devnet**.

5. **Transaction Verification**  
   - The adapter receives the transaction signature (TxID).
   - Confirmation status is checked on-chain.
   - Error states are validated.

6. **State Synchronization**  
   Once verified:
   - Market liquidity is updated.
   - User positions are updated.
   - The frontend receives refreshed market data.

⚠️ **No UI state is updated unless the transaction is confirmed on-chain**, preventing spoofed or fake executions.

---

## 🔧 Technical Deep Dive

### Solana Integration ⚡
- Runs entirely on **Solana Devnet**
- Uses `@solana/web3.js` and `@solana/wallet-adapter`
- Fast finality enables a Web2-like user experience

---

### PNP Adapter (Plug-N-Play Web3 Adapter) 🔌

The PNP Adapter abstracts blockchain complexity and enforces security.

**Why it exists:**
- Avoids repetitive `web3.js` logic across UI components
- Centralizes transaction creation and verification
- Ensures trustless UI updates

**Key Responsibilities:**
- Build unsigned transactions
- Submit signed transactions
- Verify confirmation & error states
- Decouple blockchain logic from UI

This keeps UI components focused purely on **user experience**, not blockchain internals.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Phantom or Solflare wallet set to **Devnet**
- 
- ## Deployed Link 
https://nexus-atkp.vercel.app/


### Installation

```bash
git clone https://github.com/swarnimgoyal/nexus.git
cd nexus
npm install
npm run dev

Open http://localhost:3000
 in your browser to run the app locally.

🔗 Live Demo

👉 https://nexus-atkp.vercel.app/

The live demo showcases:

On-chain prediction markets on Solana Devnet

Wallet-based trading (Yes / No positions)

Arena-based crowd sentiment predictions

Gamification via XP, badges, and leaderboards

⚠️ Devnet only — no real funds are involved.

📜 Disclaimer

This project is for educational and experimental purposes only.

No real money is used

No mainnet deployment

All markets are simulated

Always use a Solana Devnet wallet when interacting with this application.

