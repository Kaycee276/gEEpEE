import time
from typing import Any

try:
    from backend.base_agent import BaseNetworkAgent
    from backend.geepee_memory import GeePeeMemoryEngine
    from backend.virtuals_acp import VirtualsACPProtocol
except ImportError:
    from base_agent import BaseNetworkAgent
    from geepee_memory import GeePeeMemoryEngine
    from virtuals_acp import VirtualsACPProtocol


class GeePeeAgentBrain:
    """
    Core Autonomous Intelligence Loop for gEEpEE Agent.
    Coordinates Sibyl Memory 5-Tier Retrieval, Base Onchain Swaps, and Virtuals ACP Signals.
    """

    def __init__(self, memory_engine: GeePeeMemoryEngine, base_agent: BaseNetworkAgent, virtuals_acp: VirtualsACPProtocol):
        self.memory = memory_engine
        self.base = base_agent
        self.virtuals = virtuals_acp
        
        # Seed initial strategy knowledge if memory is empty
        if self.memory.load_bearing_enabled and not self.memory.get_entity("user_strategy", "default_profile"):
            self.memory.seed_initial_knowledge()

    def run_rebalance_cycle(
        self,
        user_wallet: str | None = None,
        real_tx_hash: str | None = None,
        chain_id: int | None = 8453
    ) -> dict[str, Any]:
        """
        Executes a complete autonomous rebalance cycle.
        Demonstrates why Sibyl Memory is LOAD-BEARING.
        Uses the connected Web3 wallet when provided.
        """
        reasoning_steps = []
        cycle_start_time = time.time()
        
        # Override wallet if provided by connected Web3 wallet
        if user_wallet:
            self.base.wallet_address = user_wallet
        
        # STEP 1: Query Sibyl Memory for User Strategy Entity
        reasoning_steps.append({
            "step": "01_MEMORY_QUERY",
            "title": "Querying Sibyl Memory (WARM Tier)",
            "detail": "Fetching category='user_strategy', name='default_profile' via local SQLite engine."
        })
        
        # Litmus Gate Check: Attempt to read memory
        strategy = self.memory.get_entity("user_strategy", "default_profile")
        
        if not self.memory.load_bearing_enabled or not strategy:
            # GATE FAILURE CASE: Memory is disabled or deleted
            fail_msg = "CRITICAL FAILURE (Gate Litmus Test): Sibyl Memory layer is removed or disabled. Agent cannot access user risk rules, target allocations, or stop-loss limits."
            self.memory.write_event("rebalance_failed", {"error": "Load-bearing memory missing"})
            
            return {
                "success": False,
                "gate_status": "FAILED (Memory Layer Missing)",
                "error": fail_msg,
                "reasoning_steps": reasoning_steps,
                "executed_swap": None,
                "acp_job": None,
                "memory_used": False
            }

        # Memory successfully retrieved!
        user_name = strategy.get("user_name", "User")
        target_alloc = strategy.get("target_allocation", {})
        max_slippage = strategy.get("max_slippage_pct", 0.5)
        stop_loss_pct = strategy.get("stop_loss_pct", 5.0)

        reasoning_steps.append({
            "step": "02_MEMORY_RECALLED",
            "title": "Sibyl Memory Recalled",
            "detail": f"Loaded profile for '{user_name}'. Targets: {target_alloc}. Max Slippage: {max_slippage}%. Stop Loss: {stop_loss_pct}%."
        })

        # STEP 2: Query Past Execution Journal (COLD Tier) & Search History (FTS5)
        recent_events = self.memory.read_events(limit=3)
        search_results = self.memory.search_memory("rebalance")
        
        reasoning_steps.append({
            "step": "03_JOURNAL_AUDIT",
            "title": "Auditing COLD Journal & FTS5 History",
            "detail": f"Reviewed {len(recent_events)} past event logs. FTS5 search found {len(search_results)} relevant history snippets."
        })

        # STEP 3: Read Live Balances & Prices on Base Network
        balances = self.base.balances
        prices = self.base.fetch_base_token_prices()
        
        total_value_usd = sum(balances.get(tok, 0) * prices.get(tok, 1.0) for tok in balances)
        
        current_alloc_pct = {}
        for tok in target_alloc:
            tok_val = balances.get(tok, 0) * prices.get(tok, 1.0)
            current_alloc_pct[tok] = (tok_val / total_value_usd * 100) if total_value_usd > 0 else 0.0

        reasoning_steps.append({
            "step": "04_BASE_ANALYSIS",
            "title": "Analyzing Base Network Portfolio",
            "detail": f"Total Portfolio Value: ${total_value_usd:,.2f} USD. Current Allocations: {current_alloc_pct}."
        })

        # STEP 4: Determine Target Swap based on Stored Strategy
        # Find token with highest surplus and token with highest deficit
        over_token = None
        under_token = None
        max_surplus = 0.0
        max_deficit = 0.0

        for tok, target_pct in target_alloc.items():
            curr_pct = current_alloc_pct.get(tok, 0.0)
            diff = curr_pct - target_pct
            if diff > max_surplus:
                max_surplus = diff
                over_token = tok
            elif (-diff) > max_deficit:
                max_deficit = -diff
                under_token = tok

        if not over_token or not under_token or max_surplus < 1.0:
            # Portfolio already in sync
            msg = "Portfolio is currently within target allocation parameters."
            self.memory.set_state("last_rebalance_status", {"status": "IN_SYNC", "time": time.time()})
            
            return {
                "success": True,
                "gate_status": "PASSED (Load-bearing Memory Active)",
                "status_message": msg,
                "reasoning_steps": reasoning_steps,
                "total_portfolio_usd": round(total_value_usd, 2),
                "current_allocations": {k: round(v, 2) for k, v in current_alloc_pct.items()},
                "executed_swap": None,
                "acp_job": None,
                "memory_used": True
            }

        # Amount to swap (convert part of surplus over_token to under_token)
        swap_usd_amount = min(max_surplus / 100 * total_value_usd * 0.5, 100.0) # swap up to $100
        amount_in = swap_usd_amount / prices.get(over_token, 1.0)

        reasoning_steps.append({
            "step": "05_STRATEGY_DECISION",
            "title": "Calculated Optimal Base Swap",
            "detail": f"Surplus in {over_token} (+{max_surplus:.1f}%). Deficit in {under_token} (-{max_deficit:.1f}%). Rebalancing ${swap_usd_amount:.2f} USD ({amount_in:.4f} {over_token} -> {under_token})."
        })

        # STEP 5: Execute Onchain Swap on Base DEX Router
        swap_result = self.base.execute_token_swap(
            from_token=over_token,
            to_token=under_token,
            amount_in=amount_in,
            max_slippage_pct=max_slippage
        )

        if real_tx_hash:
            swap_result["tx_hash"] = real_tx_hash
            domain = "sepolia.basescan.org" if chain_id == 84532 else "basescan.org"
            swap_result["explorer_url"] = f"https://{domain}/tx/{real_tx_hash}"

        if not swap_result.get("success"):
            reasoning_steps.append({
                "step": "06_BASE_EXECUTION_ERROR",
                "title": "Base DEX Execution Failed",
                "detail": swap_result.get("error")
            })
            return {
                "success": False,
                "gate_status": "PASSED (Memory Active)",
                "error": swap_result.get("error"),
                "reasoning_steps": reasoning_steps,
                "memory_used": True
            }

        reasoning_steps.append({
            "step": "06_BASE_EXECUTION_SUCCESS",
            "title": "Executed Onchain Swap on Base",
            "detail": f"Tx Hash: {swap_result['tx_hash']} | Swapped {swap_result['amount_in']} {over_token} for {swap_result['amount_out']} {under_token} via Aerodrome Router."
        })

        # STEP 6: Write Execution Event to Sibyl COLD Journal & Update HOT State
        self.memory.write_event(
            action="onchain_rebalance_swap",
            details={
                "from_token": over_token,
                "to_token": under_token,
                "amount_in": swap_result["amount_in"],
                "amount_out": swap_result["amount_out"],
                "gas_usd": swap_result["gas_cost_usd"]
            },
            tx_hash=swap_result["tx_hash"]
        )

        self.memory.set_state("active_portfolio_lock", {
            "last_swap_tx": swap_result["tx_hash"],
            "timestamp": time.time(),
            "status": "REBALANCED"
        })

        reasoning_steps.append({
            "step": "07_MEMORY_JOURNAL_SAVED",
            "title": "Saved to Sibyl COLD Journal & HOT State",
            "detail": "Recorded transaction hash and updated working state in local SQLite database."
        })

        # STEP 7: Broadcast Virtuals Protocol ACP Job
        acp_job = self.virtuals.broadcast_acp_job(
            job_type="ACP_SIGNAL_REBALANCE",
            payload={
                "agent": "gEEpEE",
                "base_tx_hash": swap_result["tx_hash"],
                "rebalanced_pair": f"{over_token}/{under_token}",
                "total_portfolio_usd": round(total_value_usd, 2)
            }
        )

        reasoning_steps.append({
            "step": "08_VIRTUALS_ACP_EMITTED",
            "title": "Emitted Virtuals ACP Job Signal",
            "detail": f"ACP Job ID: {acp_job['job_id']} signed and broadcast to peer agents."
        })

        # Calculate new allocations post-swap
        new_balances = self.base.balances
        new_total_usd = sum(new_balances.get(tok, 0) * prices.get(tok, 1.0) for tok in new_balances)
        new_alloc_pct = {tok: round((new_balances.get(tok, 0) * prices.get(tok, 1.0) / new_total_usd * 100), 2) for tok in target_alloc}

        return {
            "success": True,
            "gate_status": "PASSED (Load-bearing Memory Active)",
            "execution_time_sec": round(time.time() - cycle_start_time, 3),
            "reasoning_steps": reasoning_steps,
            "total_portfolio_usd": round(new_total_usd, 2),
            "new_allocations": new_alloc_pct,
            "executed_swap": swap_result,
            "acp_job": acp_job,
            "memory_used": True
        }
