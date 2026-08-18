import type {
  StatusData,
  MemoryDump,
  RebalanceResult,
  SearchResultItem,
} from "../types";

const API_BASE = "http://localhost:8000/api";

export async function fetchStatus(): Promise<StatusData> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

export async function fetchMemory(): Promise<MemoryDump> {
  const res = await fetch(`${API_BASE}/memory`);
  if (!res.ok) throw new Error("Failed to fetch memory");
  return res.json();
}

export async function runRebalance(payload?: {
  user_wallet?: string;
  real_tx_hash?: string;
  chain_id?: number;
}): Promise<RebalanceResult> {
  const res = await fetch(`${API_BASE}/agent/rebalance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  return res.json();
}

export async function toggleLoadBearing(
  enabled: boolean,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/memory/toggle-load-bearing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  return res.json();
}

export async function triggerColdStart(): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/memory/cold-start`, { method: "POST" });
  return res.json();
}

export async function searchMemory(query: string): Promise<SearchResultItem[]> {
  const res = await fetch(`${API_BASE}/memory/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  return data.results || [];
}

export async function updateStrategy(payload: {
  user_name: string;
  risk_tolerance: string;
  target_allocation: Record<string, number>;
  max_slippage_pct: number;
  user_wallet?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/agent/update-strategy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function triggerX402Payment(payload?: {
  user_wallet?: string;
  real_tx_hash?: string;
  chain_id?: number;
}): Promise<{
  verified: boolean;
  x402_payment_header: string;
  tx_hash?: string;
  explorer_url?: string;
}> {
  const res = await fetch(`${API_BASE}/base/x402-fetch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "base-oracle/volatility",
      cost_usdc: 0.01,
      user_wallet: payload?.user_wallet,
      real_tx_hash: payload?.real_tx_hash,
      chain_id: payload?.chain_id || 8453,
    }),
  });
  return res.json();
}
