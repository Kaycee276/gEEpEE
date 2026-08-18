import React, { useState, useEffect } from "react";
import {
  Brain,
  Zap,
  RefreshCw,
  Database,
  Search,
  AlertTriangle,
  ExternalLink,
  Cpu,
  Sparkles,
  Sliders,
  DollarSign,
  Activity,
  Radio,
} from "lucide-react";

const API_BASE = "http://localhost:8000/api";

interface StatusData {
  agent_name: string;
  description: string;
  memory_stats: {
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
  };
  wallet_info: {
    wallet_address: string;
    chain: string;
    status: string;
    balances: Record<string, number>;
  };
  virtuals_registry: {
    agent_id: string;
    name: string;
    protocol: string;
    total_acp_jobs_executed: number;
  };
  token_prices: Record<string, number>;
}

interface MemoryDump {
  load_bearing_enabled: boolean;
  hot_state: any;
  warm_entities: Array<{
    category: string;
    name: string;
    body: any;
    updated_at: string;
  }>;
  cold_journal: Array<{
    action: string;
    details: any;
    tx_hash?: string;
    timestamp: string;
  }>;
  reference_docs: Array<any>;
}

export default function App() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [memoryDump, setMemoryDump] = useState<MemoryDump | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "memory" | "strategy" | "acp"
  >("overview");
  const [memoryTierTab, setMemoryTierTab] = useState<
    "warm" | "cold" | "hot" | "reference"
  >("warm");

  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceResult, setRebalanceResult] = useState<any | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  // Strategy Form State
  const [usdcTarget, setUsdcTarget] = useState(40);
  const [wethTarget, setWethTarget] = useState(35);
  const [aeroTarget, setAeroTarget] = useState(15);
  const [virtualTarget, setVirtualTarget] = useState(10);
  const [slippage, setSlippage] = useState(0.5);

  const fetchAllData = async () => {
    try {
      const resStatus = await fetch(`${API_BASE}/status`);
      const dataStatus = await resStatus.json();
      setStatus(dataStatus);

      const resMem = await fetch(`${API_BASE}/memory`);
      const dataMem = await resMem.json();
      setMemoryDump(dataMem);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunRebalance = async () => {
    setIsRebalancing(true);
    setRebalanceResult(null);
    try {
      const res = await fetch(`${API_BASE}/agent/rebalance`, {
        method: "POST",
      });
      const data = await res.json();
      setRebalanceResult(data);
      setNotice(data.gate_status);
      fetchAllData();
    } catch (err) {
      console.error(err);
      setRebalanceResult({
        success: false,
        error: "Network error connecting to gEEpEE backend server.",
      });
    } finally {
      setIsRebalancing(false);
    }
  };

  const handleToggleMemory = async (enabled: boolean) => {
    try {
      const res = await fetch(`${API_BASE}/memory/toggle-load-bearing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      setNotice(data.message);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleColdStart = async () => {
    try {
      const res = await fetch(`${API_BASE}/memory/cold-start`, {
        method: "POST",
      });
      const data = await res.json();
      setNotice(data.message);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/memory/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        user_name: "Hackathon Judge",
        risk_tolerance: "moderate",
        target_allocation: {
          USDC: usdcTarget,
          WETH: wethTarget,
          AERO: aeroTarget,
          VIRTUAL: virtualTarget,
        },
        max_slippage_pct: slippage,
      };
      const res = await fetch(`${API_BASE}/agent/update-strategy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setNotice(data.message);
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerX402 = async () => {
    try {
      const res = await fetch(`${API_BASE}/base/x402-fetch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: "base-oracle/volatility",
          cost_usdc: 0.01,
        }),
      });
      const data = await res.json();
      setNotice(
        `x402 Micropayment Result: Header ${data.x402_payment_header} (-$0.01 USDC on Base)`,
      );
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const memoryEnabled = status?.memory_stats?.load_bearing_enabled ?? true;

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* HEADER BAR */}
      <header
        className="glass-panel"
        style={{ padding: "20px 24px", marginBottom: "24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #eab308 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              <Brain size={28} />
            </div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <h1
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                  }}
                >
                  gEEpEE
                </h1>
                <span className="badge badge-sibyl">Sibyl Labs Agent</span>
              </div>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "0.875rem",
                  marginTop: "2px",
                }}
              >
                Autonomous Memory-Driven Onchain Vault Agent on Base & Virtuals
                Protocol
              </p>
            </div>
          </div>

          {/* NETWORK & HEALTH BADGES */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <div className="badge badge-base">
              <Cpu size={14} /> Base Mainnet (8453)
            </div>
            <div className="badge badge-virtuals">
              <Radio size={14} /> Virtuals ACP Active
            </div>
            <div
              className={`badge ${memoryEnabled ? "badge-success" : "badge-danger"}`}
            >
              <Database size={14} /> SQLite 5-Tier (
              {status?.memory_stats?.db_size_kb || 0} KB)
            </div>
          </div>
        </div>
      </header>

      {/* NOTIFICATION BANNER */}
      {notice && (
        <div
          className="glass-panel"
          style={{
            padding: "12px 20px",
            marginBottom: "24px",
            background: "rgba(6, 182, 212, 0.1)",
            borderColor: "var(--accent-cyan)",
            color: "#e0f2fe",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.9rem",
            }}
          >
            <Sparkles size={18} style={{ color: "var(--accent-cyan)" }} />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* GATE TESTING & ACTION BAR */}
      <section
        className="glass-panel"
        style={{ padding: "20px 24px", marginBottom: "24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          {/* PRIMARY ACTIONS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleRunRebalance}
              disabled={isRebalancing}
              style={{
                background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
                color: "#000",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: isRebalancing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(234, 179, 8, 0.3)",
                transition: "transform 0.15s ease",
              }}
            >
              {isRebalancing ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Zap size={18} />
              )}
              {isRebalancing
                ? "Running Rebalance Loop..."
                : "Run Autonomous Rebalance"}
            </button>

            <button
              onClick={handleColdStart}
              style={{
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <RefreshCw size={16} /> Cold-Start Recall Demo
            </button>

            <button
              onClick={handleTriggerX402}
              style={{
                background: "rgba(0, 82, 255, 0.15)",
                color: "#60a5fa",
                border: "1px solid rgba(0, 82, 255, 0.3)",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <DollarSign size={16} /> Test Base x402 Header
            </button>
          </div>

          {/* LITMUS GATE TEST SWITCH */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "var(--bg-card)",
              padding: "10px 18px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--accent-gold)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Litmus Gate Test (Judges)
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: memoryEnabled
                    ? "var(--accent-emerald)"
                    : "var(--accent-red)",
                  fontWeight: 600,
                }}
              >
                {memoryEnabled
                  ? "Memory Layer: ACTIVE (Load-Bearing)"
                  : "Memory Layer: REMOVED (Gate Test Mode)"}
              </span>
            </div>

            <button
              onClick={() => handleToggleMemory(!memoryEnabled)}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: memoryEnabled
                  ? "var(--accent-red)"
                  : "var(--accent-emerald)",
                color: "#fff",
              }}
            >
              {memoryEnabled ? "Simulate Delete Memory" : "Restore Memory"}
            </button>
          </div>
        </div>
      </section>

      {/* DASHBOARD NAVIGATION TABS */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "8px",
        }}
      >
        {[
          { id: "overview", label: "Portfolio & Base Engine", icon: Activity },
          {
            id: "memory",
            label: "Sibyl 5-Tier Memory Inspector",
            icon: Database,
          },
          { id: "strategy", label: "Strategy & WARM Entities", icon: Sliders },
          { id: "acp", label: "Virtuals ACP Protocol", icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: isActive ? "var(--bg-card)" : "transparent",
                color: isActive
                  ? "var(--accent-gold)"
                  : "var(--text-secondary)",
                border: isActive
                  ? "1px solid var(--border-strong)"
                  : "1px solid transparent",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OVERVIEW & PORTFOLIO */}
      {activeTab === "overview" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "24px",
          }}
        >
          {/* BASE PORTFOLIO CARD */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Cpu style={{ color: "#3b82f6" }} size={20} /> Base Network
                Vault Portfolio
              </h3>
              <span className="badge badge-base">
                {status?.wallet_info?.chain}
              </span>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Wallet Address
              </p>
              <p
                className="font-mono"
                style={{
                  fontSize: "0.9rem",
                  color: "var(--accent-cyan)",
                  marginTop: "4px",
                }}
              >
                {status?.wallet_info?.wallet_address}
              </p>
            </div>

            {/* TOKEN BALANCES */}
            <h4
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "12px",
              }}
            >
              Onchain Balances & Target Allocation
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {Object.entries(status?.wallet_info?.balances || {}).map(
                ([token, amount]) => {
                  const price = status?.token_prices?.[token] || 1;
                  const valueUsd = amount * price;
                  return (
                    <div
                      key={token}
                      style={{
                        background: "var(--bg-card)",
                        padding: "14px 18px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "#fff" }}>
                          {token}
                        </span>
                        <span
                          className="font-mono"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {amount.toFixed(4)} {token} ($
                          {valueUsd.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          USD)
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Market Price: ${price.toFixed(2)} USD
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* AGENT COGNITIVE REASONING TERMINAL */}
          <div className="glass-panel" style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Brain style={{ color: "var(--accent-gold)" }} size={20} />{" "}
                gEEpEE Cognitive Terminal
              </h3>
              <span
                className={`badge ${rebalanceResult?.memory_used ? "badge-success" : "badge-danger"}`}
              >
                {rebalanceResult
                  ? rebalanceResult.gate_status
                  : "Ready for Rebalance"}
              </span>
            </div>

            {!rebalanceResult ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--text-muted)",
                }}
              >
                <Activity
                  size={36}
                  style={{ margin: "0 auto 12px", opacity: 0.5 }}
                />
                <p>
                  Click "Run Autonomous Rebalance" above to observe gEEpEE's
                  memory recall & Base onchain execution workflow.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {rebalanceResult.error && (
                  <div
                    style={{
                      background: "rgba(239, 68, 68, 0.15)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      padding: "14px",
                      borderRadius: "8px",
                      color: "#fca5a5",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <AlertTriangle size={18} /> Rebalance Halted (Litmus Gate
                      Fail)
                    </div>
                    <p style={{ fontSize: "0.85rem", marginTop: "6px" }}>
                      {rebalanceResult.error}
                    </p>
                  </div>
                )}

                {rebalanceResult.reasoning_steps?.map(
                  (step: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-card)",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        borderLeft: "4px solid var(--accent-gold)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "4px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--accent-gold)",
                          }}
                        >
                          {step.step}
                        </span>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          {step.title}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.825rem",
                          color: "var(--text-secondary)",
                          marginTop: "4px",
                        }}
                      >
                        {step.detail}
                      </p>
                    </div>
                  ),
                )}

                {rebalanceResult.executed_swap && (
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      padding: "14px",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--accent-emerald)",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        marginBottom: "6px",
                      }}
                    >
                      Onchain Base Swap Verified
                    </div>
                    <p
                      className="font-mono"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-primary)",
                        wordBreak: "break-all",
                      }}
                    >
                      Tx Hash: {rebalanceResult.executed_swap.tx_hash}
                    </p>
                    <a
                      href={rebalanceResult.executed_swap.explorer_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--accent-cyan)",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "8px",
                        textDecoration: "none",
                      }}
                    >
                      View on Basescan <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: SIBYL 5-TIER MEMORY INSPECTOR */}
      {activeTab === "memory" && (
        <div className="glass-panel" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Database style={{ color: "var(--accent-gold)" }} size={22} />{" "}
                Sibyl 5-Tier Memory Architecture Inspector
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                Local SQLite Database (`{status?.memory_stats?.db_path}`). Zero
                Embeddings · FTS5 Powered.
              </p>
            </div>

            {/* FTS5 SEARCH FORM */}
            <form
              onSubmit={handleSearch}
              style={{ display: "flex", gap: "8px" }}
            >
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="FTS5 Search Memory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-strong)",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "6px",
                    color: "#fff",
                    fontSize: "0.875rem",
                    width: "240px",
                  }}
                />
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "10px",
                    color: "var(--text-muted)",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: "var(--accent-gold)",
                  color: "#000",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </form>
          </div>

          {/* SEARCH RESULTS DISPLAY */}
          {searchResults.length > 0 && (
            <div
              style={{
                background: "var(--bg-card)",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "24px",
                border: "1px solid var(--accent-gold)",
              }}
            >
              <h4
                style={{
                  fontSize: "0.9rem",
                  color: "var(--accent-gold)",
                  marginBottom: "10px",
                }}
              >
                FTS5 Search Results for "{searchQuery}":
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span className="badge badge-sibyl">{item.category}</span>{" "}
                    <strong>{item.name}</strong>: {item.snippet}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MEMORY TIER SELECTOR */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              borderBottom: "1px solid var(--border-color)",
              paddingBottom: "10px",
            }}
          >
            {[
              {
                id: "warm",
                label: `WARM Entities (${memoryDump?.warm_entities?.length || 0})`,
              },
              {
                id: "cold",
                label: `COLD Journal (${memoryDump?.cold_journal?.length || 0})`,
              },
              { id: "hot", label: "HOT State" },
              { id: "reference", label: "REFERENCE Docs" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMemoryTierTab(t.id as any)}
                style={{
                  background:
                    memoryTierTab === t.id
                      ? "var(--accent-gold-glow)"
                      : "transparent",
                  color:
                    memoryTierTab === t.id
                      ? "var(--accent-gold)"
                      : "var(--text-secondary)",
                  border:
                    memoryTierTab === t.id
                      ? "1px solid var(--accent-gold)"
                      : "1px solid transparent",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TIER CONTENTS */}
          {memoryTierTab === "warm" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {memoryDump?.warm_entities?.map((ent, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span className="badge badge-sibyl">{ent.category}</span>
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Updated: {ent.updated_at}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "8px",
                    }}
                  >
                    {ent.name}
                  </h4>
                  <pre
                    className="font-mono"
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--accent-cyan)",
                      background: "var(--bg-surface)",
                      padding: "12px",
                      borderRadius: "6px",
                      overflowX: "auto",
                    }}
                  >
                    {JSON.stringify(ent.body, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {memoryTierTab === "cold" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {memoryDump?.cold_journal?.map((j, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    padding: "14px",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--accent-gold)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {j.action}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {j.timestamp}
                    </span>
                  </div>
                  {j.tx_hash && (
                    <div
                      className="font-mono"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--accent-cyan)",
                        marginTop: "4px",
                      }}
                    >
                      Tx Hash: {j.tx_hash}
                    </div>
                  )}
                  {j.details && (
                    <pre
                      className="font-mono"
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-secondary)",
                        marginTop: "6px",
                        background: "var(--bg-surface)",
                        padding: "8px",
                        borderRadius: "4px",
                      }}
                    >
                      {JSON.stringify(j.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}

          {memoryTierTab === "hot" && (
            <div
              style={{
                background: "var(--bg-card)",
                padding: "16px",
                borderRadius: "8px",
              }}
            >
              <h4
                style={{
                  fontSize: "0.9rem",
                  color: "#fff",
                  marginBottom: "8px",
                }}
              >
                HOT Working State (Active Locks & Working Memory)
              </h4>
              <pre
                className="font-mono"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--accent-cyan)",
                  background: "var(--bg-surface)",
                  padding: "14px",
                  borderRadius: "6px",
                }}
              >
                {JSON.stringify(memoryDump?.hot_state, null, 2)}
              </pre>
            </div>
          )}

          {memoryTierTab === "reference" && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {memoryDump?.reference_docs?.map(
                (doc, idx) =>
                  doc && (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-card)",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "0.95rem",
                          fontWeight: 700,
                          color: "#fff",
                          marginBottom: "4px",
                        }}
                      >
                        {doc.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--text-secondary)",
                          marginTop: "6px",
                        }}
                      >
                        {doc.content}
                      </p>
                    </div>
                  ),
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: STRATEGY CONFIGURATOR */}
      {activeTab === "strategy" && (
        <div
          className="glass-panel"
          style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}
        >
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sliders style={{ color: "var(--accent-gold)" }} size={22} />{" "}
            Configure Target Strategy & Risk Rules
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginBottom: "24px",
            }}
          >
            Saving writes directly to Sibyl Memory WARM tier under unique
            constraint `(tenant_id, 'user_strategy', 'default_profile')`.
          </p>

          <form
            onSubmit={handleSaveStrategy}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  USDC Target Allocation (%)
                </label>
                <input
                  type="number"
                  value={usdcTarget}
                  onChange={(e) => setUsdcTarget(Number(e.target.value))}
                  style={{
                    width: "100%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-strong)",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  WETH Target Allocation (%)
                </label>
                <input
                  type="number"
                  value={wethTarget}
                  onChange={(e) => setWethTarget(Number(e.target.value))}
                  style={{
                    width: "100%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-strong)",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  AERO Target Allocation (%)
                </label>
                <input
                  type="number"
                  value={aeroTarget}
                  onChange={(e) => setAeroTarget(Number(e.target.value))}
                  style={{
                    width: "100%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-strong)",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  VIRTUAL Target Allocation (%)
                </label>
                <input
                  type="number"
                  value={virtualTarget}
                  onChange={(e) => setVirtualTarget(Number(e.target.value))}
                  style={{
                    width: "100%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-strong)",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#fff",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginBottom: "6px",
                }}
              >
                Max Slippage Tolerance (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
                style={{
                  width: "100%",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-strong)",
                  padding: "10px",
                  borderRadius: "6px",
                  color: "#fff",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
                color: "#000",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                marginTop: "12px",
              }}
            >
              Save Strategy to Sibyl Memory
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT 4: VIRTUALS ACP PROTOCOL */}
      {activeTab === "acp" && (
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "#fff",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Radio style={{ color: "#c084fc" }} size={22} /> Virtuals Protocol
            Agent Communication Protocol (ACP)
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              marginBottom: "24px",
            }}
          >
            gEEpEE broadcasts inter-agent signals to partner agents on the
            Virtuals ACP network.
          </p>

          <div
            style={{
              background: "var(--bg-card)",
              padding: "18px",
              borderRadius: "8px",
              marginBottom: "24px",
              border: "1px solid rgba(168, 85, 247, 0.3)",
            }}
          >
            <h4
              style={{
                color: "#c084fc",
                fontSize: "0.95rem",
                marginBottom: "8px",
              }}
            >
              Registered Virtuals Agent Metadata
            </h4>
            <pre
              className="font-mono"
              style={{
                fontSize: "0.85rem",
                color: "#e9d5ff",
                background: "var(--bg-surface)",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              {JSON.stringify(status?.virtuals_registry, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
