# gEEpEE · Autonomous Memory-Driven Vault Agent

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sibyl Memory](https://img.shields.io/badge/Memory-Sibyl%205--Tier%20SQLite-gold)](https://docs.sibyllabs.org)
[![Base Network](https://img.shields.io/badge/Chain-Base%20(ChainID%208453)-blue)](https://base.org)
[![Virtuals Protocol](https://img.shields.io/badge/Protocol-Virtuals%20ACP-purple)](https://virtuals.io)

**gEEpEE** is an autonomous, memory-driven DeFi vault and strategy manager operating on **Base** and **Virtuals Protocol**. It uses **Sibyl Memory** (5-tier local-first SQLite + FTS5 full-text search) to maintain persistent strategy rules, user risk profiles, execution journals, and knowledge graphs across sessions.

---

## 🔑 Key Features

- **Load-Bearing Sibyl Memory Engine:** Uses all 5 tiers of Sibyl Memory (`HOT` working state, `WARM` entity knowledge graph, `COLD` time-series journal, `REFERENCE` docs, and `ARCHIVE`).
- **Base Network Onchain Execution:** Executes token swaps via Base DEX routers (Aerodrome / Uniswap V3) with gas optimization and verified transaction hashes. Includes **x402 micropayment header** support for Base market feeds.
- **Virtuals Protocol ACP Integration:** Emits signed **Agent Communication Protocol (ACP)** job signals to coordinate portfolio actions across peer agents.
- **Litmus Gate Verification & Cold-Start Demo:** Includes a built-in switch to toggle memory ON/OFF (proving core execution fails without memory) and a cold-start restart button to demonstrate fresh-session memory recall.

---

## 📍 Where Memory is Load-Bearing (Litmus Gate Location)

Sibyl Memory is on the critical path of **gEEpEE**. If the memory layer is removed or disabled, the agent fails to retrieve user risk limits, stop-loss thresholds, and target allocations, halting execution safely.

- **[backend/geepee_memory.py](file:///home/kaycee/Desktop/hackathon/geepee/backend/geepee_memory.py#L1-L245):** 5-Tier SQLite + FTS5 engine wrapper implementing `set_entity`, `get_entity`, `write_event`, and `search_memory`.
- **[backend/agent_brain.py#L32-L55](file:///home/kaycee/Desktop/hackathon/geepee/backend/agent_brain.py#L32-L55):** Critical path memory query. Line 38 fetches `category='user_strategy'`, `name='default_profile'`. If memory is disabled (`load_bearing_enabled == False`), the agent returns **`GATE FAILURE: Load-bearing memory missing`**.

---

## 🤝 Partner Stack Integrations

### 1. Base Network (+15% Multiplier)
- **Code:** [`backend/base_agent.py`](file:///home/kaycee/Desktop/hackathon/geepee/backend/base_agent.py)
- **Features:** Wallet management, Base DEX router execution, transaction hash generation, and x402 payment header verification.

### 2. Virtuals Protocol (+10% Multiplier)
- **Code:** [`backend/virtuals_acp.py`](file:///home/kaycee/Desktop/hackathon/geepee/backend/virtuals_acp.py)
- **Features:** Virtuals agent registration schema and ACP (`Agent Communication Protocol`) job signal broadcasting.

---

## 💡 How Memory Made This Possible

Traditional DeFi bots either run stateless (relying on hardcoded parameters) or use cloud-based vector databases that hallucinate user preferences. **gEEpEE** uses Sibyl's local-first SQLite schema with a `UNIQUE(tenant_id, category, name)` constraint on the `WARM` tier. This guarantees deterministic schema enforcement—meaning gEEpEE never drifts or misreads user risk profiles across multi-turn sessions.

---

## 🚀 Quick Start & Installation

### 1. Backend Setup (FastAPI & Sibyl Memory)

```bash
# Python 3.12+
python3 -m pip install --user --break-system-packages sibyl-memory-client web3 fastapi uvicorn requests pydantic

# Run Backend Server (Port 8000)
python3 backend/server.py
```

### 2. Frontend Dashboard Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` to access the **gEEpEE** Autonomous Vault Dashboard.

---

## 📜 Prior Work Declaration

All code in this repository was built during the Sibyl Labs Hackathon build window. Built using open-source packages (`sibyl-memory-client`, `web3`, `fastapi`, `react`, `vite`, `lucide-react`).

---

## 📄 License

MIT License. Copyright (c) 2026.
