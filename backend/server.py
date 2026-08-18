from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import gEEpEE backend modules
try:
    from backend.agent_brain import GeePeeAgentBrain
    from backend.base_agent import BaseNetworkAgent
    from backend.geepee_memory import GeePeeMemoryEngine
    from backend.virtuals_acp import VirtualsACPProtocol
except ImportError:
    from agent_brain import GeePeeAgentBrain
    from base_agent import BaseNetworkAgent
    from geepee_memory import GeePeeMemoryEngine
    from virtuals_acp import VirtualsACPProtocol

app = FastAPI(
    title="gEEpEE Agent API",
    description="Autonomous Memory-Driven Onchain Vault Agent on Base & Virtuals Protocol",
    version="1.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global singletons
memory_engine = GeePeeMemoryEngine()
base_agent = BaseNetworkAgent()
virtuals_acp = VirtualsACPProtocol()
agent_brain = GeePeeAgentBrain(memory_engine, base_agent, virtuals_acp)


# Pydantic schemas
class StrategyUpdateRequest(BaseModel):
    user_name: str | None = "Hackathon Judge"
    risk_tolerance: str | None = "moderate"
    target_allocation: dict[str, float]
    max_slippage_pct: float | None = 0.5
    stop_loss_pct: float | None = 5.0
    user_wallet: str | None = None

class LoadBearingToggleRequest(BaseModel):
    enabled: bool

class SearchQueryRequest(BaseModel):
    query: str

class RebalanceCycleRequest(BaseModel):
    user_wallet: str | None = None
    real_tx_hash: str | None = None
    chain_id: int | None = 8453

class X402PaymentRequest(BaseModel):
    endpoint: str = "market-feed/base-volatility"
    cost_usdc: float = 0.01
    user_wallet: str | None = None
    real_tx_hash: str | None = None
    chain_id: int | None = 8453


@app.get("/api/status")
def get_system_status():
    """Returns overview of gEEpEE memory stats, wallet balances, recalled strategy, and ACP agent status."""
    return {
        "agent_name": "gEEpEE",
        "description": "Autonomous Memory-Driven Vault Agent on Base",
        "recalled_strategy": memory_engine.get_entity("user_strategy", "default_profile"),
        "memory_stats": memory_engine.get_full_stats(),
        "wallet_info": base_agent.get_wallet_info(),
        "virtuals_registry": virtuals_acp.get_agent_registry_info(),
        "token_prices": base_agent.fetch_base_token_prices()
    }


@app.get("/api/memory")
def get_memory_dump():
    """Returns all contents across Sibyl 5-Tiers (HOT, WARM, COLD, REFERENCE, ARCHIVE)."""
    return {
        "load_bearing_enabled": memory_engine.load_bearing_enabled,
        "hot_state": {
            "last_status": memory_engine.get_state("last_rebalance_status"),
            "active_lock": memory_engine.get_state("active_portfolio_lock")
        },
        "warm_entities": memory_engine.list_entities(),
        "cold_journal": memory_engine.read_events(limit=30),
        "reference_docs": [
            memory_engine.get_reference("base_network_spec"),
            memory_engine.get_reference("virtuals_acp_spec")
        ],
        "archive_entities": memory_engine.get_full_stats()["counts"]["archive_entities"]
    }


@app.post("/api/memory/search")
def search_memory(req: SearchQueryRequest):
    """Performs FTS5 search across all Sibyl memory tiers."""
    results = memory_engine.search_memory(req.query)
    return {"query": req.query, "count": len(results), "results": results}


@app.post("/api/memory/toggle-load-bearing")
def toggle_load_bearing(req: LoadBearingToggleRequest):
    """
    Toggles the Sibyl Memory Layer ON/OFF.
    Used for the Litmus Gate Deletion Test during judging.
    """
    memory_engine.load_bearing_enabled = req.enabled
    status_str = "ENABLED (Normal Operations)" if req.enabled else "DISABLED (Litmus Gate Memory Removal Active)"
    
    return {
        "success": True,
        "load_bearing_enabled": memory_engine.load_bearing_enabled,
        "message": f"Sibyl Memory layer is now {status_str}."
    }


@app.post("/api/memory/cold-start")
def trigger_cold_start():
    """
    Triggers a fresh session restart (Cold-Start Recall Beat).
    Verifies that gEEpEE recalls persistent user state from SQLite disk.
    """
    # Re-read memory from disk
    recalled_strategy = memory_engine.get_entity("user_strategy", "default_profile")
    journal_count = len(memory_engine.read_events(limit=10))
    
    return {
        "success": True,
        "message": "Cold-start session restart. gEEpEE reloaded state directly from local SQLite database file on disk.",
        "recalled_strategy": recalled_strategy,
        "journal_events_count": journal_count
    }


@app.post("/api/agent/rebalance")
def trigger_agent_rebalance(req: RebalanceCycleRequest | None = None):
    """Triggers autonomous rebalance cycle in gEEpEE Agent Brain."""
    user_wallet = req.user_wallet if req else None
    real_tx_hash = req.real_tx_hash if req else None
    chain_id = req.chain_id if req else 8453
    result = agent_brain.run_rebalance_cycle(
        user_wallet=user_wallet,
        real_tx_hash=real_tx_hash,
        chain_id=chain_id
    )
    return result


@app.post("/api/agent/update-strategy")
def update_user_strategy(req: StrategyUpdateRequest):
    """Updates user strategy entity in Sibyl Memory WARM tier partitioned by wallet address."""
    tenant_id = req.user_wallet or "geepee_default"
    body = {
        "user_name": req.user_name,
        "risk_tolerance": req.risk_tolerance,
        "target_tokens": list(req.target_allocation.keys()),
        "target_allocation": req.target_allocation,
        "max_slippage_pct": req.max_slippage_pct,
        "stop_loss_pct": req.stop_loss_pct,
        "x402_feed_enabled": True
    }
    
    memory_engine.set_entity("user_strategy", "default_profile", body, tenant_id=tenant_id)
    memory_engine.write_event(
        "strategy_updated",
        {"user": req.user_name, "new_allocation": req.target_allocation},
        tenant_id=tenant_id
    )
    if req.user_wallet:
        memory_engine.upsert_user_portfolio(wallet_address=req.user_wallet, strategy=body)
    
    return {
        "success": True,
        "message": "Strategy updated in Sibyl WARM tier (UNIQUE constraint enforced).",
        "updated_entity": body
    }


@app.post("/api/base/x402-fetch")
def request_x402_feed(req: X402PaymentRequest):
    """Executes x402 payment header verification on Base network."""
    tenant_id = req.user_wallet or "geepee_default"
    result = base_agent.verify_x402_micropayment(
        endpoint=req.endpoint,
        required_cost_usdc=req.cost_usdc,
        real_tx_hash=req.real_tx_hash,
        chain_id=req.chain_id or 8453
    )
    if result["verified"]:
        memory_engine.write_event(
            action="x402_payment_executed",
            details=result,
            tx_hash=result.get("tx_hash"),
            tenant_id=tenant_id
        )
    return result


@app.get("/api/virtuals/acp-jobs")
def get_acp_jobs():
    """Returns recent Virtuals ACP Protocol job logs."""
    return {
        "registry": virtuals_acp.get_agent_registry_info(),
        "recent_jobs": virtuals_acp.get_recent_acp_jobs()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
