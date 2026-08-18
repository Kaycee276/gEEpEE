export interface MemoryStats {
  load_bearing_enabled: boolean;
  db_path: string;
  db_size_kb: number;
  counts: {
    hot_state: number;
    warm_entities: number;
    cold_journal: number;
    reference_docs: number;
    archive_entities: number;
  };
}

export interface WalletInfo {
  wallet_address: string;
  chain: string;
  status: string;
  balances: Record<string, number>;
}

export interface VirtualsRegistry {
  agent_id: string;
  name: string;
  protocol: string;
  capabilities: string[];
  reputation_score: number;
  total_acp_jobs_executed: number;
}

export interface StatusData {
  agent_name: string;
  description: string;
  recalled_strategy?: Record<string, any> | null;
  memory_stats: MemoryStats;
  wallet_info: WalletInfo;
  virtuals_registry: VirtualsRegistry;
  token_prices: Record<string, number>;
}

export interface WarmEntity {
  category: string;
  name: string;
  body: any;
  updated_at: string;
}

export interface ColdJournalEvent {
  action: string;
  details: any;
  tx_hash?: string;
  timestamp: string;
}

export interface MemoryDump {
  load_bearing_enabled: boolean;
  hot_state: any;
  warm_entities: WarmEntity[];
  cold_journal: ColdJournalEvent[];
  reference_docs: Array<{
    title: string;
    content: string;
    updated_at?: string;
  }>;
  archive_entities?: number;
}

export interface ReasoningStep {
  step: string;
  title: string;
  detail: string;
}

export interface ExecutedSwap {
  success: boolean;
  tx_hash: string;
  chain_id: number;
  dex: string;
  from_token: string;
  to_token: string;
  amount_in: number;
  amount_out: number;
  effective_price: number;
  gas_used_gwei: number;
  gas_cost_usd: number;
  block_number: number;
  explorer_url: string;
}

export interface RebalanceResult {
  success: boolean;
  gate_status: string;
  execution_time_sec?: number;
  reasoning_steps?: ReasoningStep[];
  total_portfolio_usd?: number;
  new_allocations?: Record<string, number>;
  executed_swap?: ExecutedSwap;
  acp_job?: any;
  memory_used?: boolean;
  error?: string;
}

export interface SearchResultItem {
  category: string;
  name: string;
  snippet: string;
}
