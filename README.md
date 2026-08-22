# gEEpEE · Autonomous Memory-Driven Vault Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sibyl Memory](https://img.shields.io/badge/Memory-Sibyl%205--Tier%20SQLite%20%2B%20Turso%20Cloud-gold)](https://docs.sibyllabs.org)
[![Base Network](https://img.shields.io/badge/Chain-Base%20(ChainID%208453)-blue)](https://base.org)
[![Virtuals Protocol](https://img.shields.io/badge/Protocol-Virtuals%20ACP-purple)](https://virtuals.io)

**gEEpEE** is an autonomous, memory-driven DeFi vault and portfolio strategy manager on **Base** and **Virtuals Protocol**. Built for the **Sibyl Labs Hackathon**, gEEpEE leverages **Sibyl Memory** (5-tier local-first SQLite + Turso Cloud DB REST pipeline + Drizzle ORM schemas) to store load-bearing strategy rules, user risk profiles, execution audit logs, and inter-agent job signals.

---

## 📍 1. Where Memory is Load-Bearing (Litmus Gate Location for Judges)

Sibyl Memory is strictly on the critical execution path of **gEEpEE**. If the memory layer is disabled or deleted, the agent **cannot access user risk rules, target allocations, or stop-loss limits**, causing core execution to halt immediately with an explicit error.

Judges can verify critical-path memory calls in **under 2 minutes**:

1. **[backend/agent_brain.py#L55-L71](file:///home/kaycee/Desktop/hackathon/geepee/backend/agent_brain.py#L55-L71):** Critical-path memory lookup.
   ```python
   # Reads WARM strategy entity. If memory is disabled or deleted (load_bearing_enabled == False):
   if not self.memory.load_bearing_enabled or not strategy:
       return {
           "success": False,
           "gate_status": "FAILED (Memory Layer Missing)",
           "error": "CRITICAL FAILURE (Gate Litmus Test): Sibyl Memory layer is removed or disabled."
       }
   ```
2. **[backend/geepee_memory.py](file:///home/kaycee/Desktop/hackathon/geepee/backend/geepee_memory.py):** 5-Tier Memory Engine (`HOT`, `WARM`, `COLD`, `REFERENCE`, `ARCHIVE`) with local SQLite + real-time **Turso Cloud DB LibSQL REST HTTP pipeline** sync.
3. **[frontend/src/db/schema.ts](file:///home/kaycee/Desktop/hackathon/geepee/frontend/src/db/schema.ts):** Drizzle ORM table schemas matching the Turso Cloud DB dashboard (`user_portfolios`, `warm_entities`, `cold_journal`, `hot_state`, `reference_docs`, `archive_entities`).

---

## 🧪 2. How Judges Can Test the Litmus Gate & Cold-Start Recall

### A. The Deletion Test (Litmus Gate)
1. Open the **gEEpEE Dashboard** UI.
2. In the Control Bar, click **"Delete (Litmus Test)"** to disable the Sibyl Memory layer.
3. Observe that all onchain action buttons (**Run Rebalance**, **Test x402 Header**) become **blurred (`blur(1.5px)`), dimmed, and locked (`cursor: not-allowed`)**.
4. Attempting to invoke the agent brain via API returns an explicit **Litmus Gate Failure**.

### B. Cold-Start Recall Test
1. Save a custom strategy in the **Strategy & WARM** tab.
2. Restart the backend server (`python3 backend/server.py`) or refresh the browser.
3. Click **"Cold-Start Recall"** or refresh the page.
4. **gEEpEE** instantly recalls your strategy rules, allocation targets, and time-series transaction history directly from the `WARM` and `COLD` memory tiers.

---

## 🤝 3. Partner Stack Integrations

### 🔵 Base Network (+15% Multiplier)
- **Code:** [`backend/base_agent.py`](file:///home/kaycee/Desktop/hackathon/geepee/backend/base_agent.py) & [`frontend/src/components/ControlBar.tsx`](file:///home/kaycee/Desktop/hackathon/geepee/frontend/src/components/ControlBar.tsx)
- **Integrations:**
  - Web3 wallet connection via Wagmi & RainbowKit.
  - Onchain DEX transaction logging with explorer links (`basescan.org/tx/...`).
  - **x402 Micropayment Header Verification:** Real-time HTTP 402 payment header parsing (`x402-base-usdc-tx:...`) for Base oracle volatility feeds.

### 🟣 Virtuals Protocol (+10% Multiplier)
- **Code:** [`backend/virtuals_acp.py`](file:///home/kaycee/Desktop/hackathon/geepee/backend/virtuals_acp.py) & [`frontend/src/components/VirtualsACPPanel.tsx`](file:///home/kaycee/Desktop/hackathon/geepee/frontend/src/components/VirtualsACPPanel.tsx)
- **Integrations:**
  - Virtuals Agent Registration schema.
  - **Agent Communication Protocol (ACP):** Broadcasts signed inter-agent job signals (target pair, allocation %, slippage tolerance) saved directly into Sibyl COLD memory.

---

## 🔒 4. Zero Duplicates & Connected Wallet Partitioning

- **Deduplication:** Enforces `tx_hash TEXT UNIQUE` on `cold_journal` (preventing duplicate transaction logs), `UNIQUE(tenant_id, category, name)` on `warm_entities`, and `wallet_address TEXT PRIMARY KEY` on `user_portfolios`.
- **Wallet Address Binding (`tenant_id = user_wallet`):** Every activity, strategy, and journal entry is automatically tagged with the user's connected Web3 wallet address (`0x...`), isolating multi-user portfolio records seamlessly across local SQLite and Turso Cloud DB.

---

## 💡 5. How Memory Made This Possible

Traditional vault bots are either stateless scripts with hardcoded parameters or rely on unconstrained AI models that drift across turns. **gEEpEE** uses Sibyl's 5-tier architecture to enforce deterministic execution rules. By storing risk limits in the `WARM` tier and execution events in the `COLD` journal, gEEpEE maintains full state awareness across app reboots, multi-user wallet connections, and inter-agent ACP job requests.

---

## 🚀 6. Quick Start & Setup

### Backend Setup (Python 3.12+ / FastAPI)

```bash
# Install dependencies
python3 -m pip install --user --break-system-packages sibyl-memory-client web3 fastapi uvicorn requests pydantic python-dotenv

# Run FastAPI Backend Server (Port 8000)
python3 backend/server.py
```

### Frontend Setup (React + Vite + Wagmi + Drizzle ORM)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to launch the **gEEpEE** Autonomous Vault Dashboard.

---

## 📜 7. Prior Work & License Declaration

- **Prior Work:** All code in this repository was built from scratch during the Sibyl Labs Hackathon build window (Sep 1 to 10, 2026). Built using open-source libraries (`sibyl-memory-client`, `drizzle-orm`, `@libsql/client`, `wagmi`, `viem`, `fastapi`, `react`, `vite`).
- **License:** Open source under the [MIT License](LICENSE).
