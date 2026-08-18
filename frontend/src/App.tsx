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
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        color: "#000000",
      }}
    >
      {/* HEADER BAR */}
      <header
        className="glass-panel"
        style={{
          padding: "20px 24px",
          marginBottom: "24px",
          background: "#ffffff",
        }}
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
                width: "52px",
                height: "52px",
                borderRadius: "6px",
                background: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                border: "2px solid #000000",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              <Brain size={30} />
            </div>
            <div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#000000",
                  }}
                >
                  gEEpEE
                </h1>
                <span className="badge badge-sibyl">Sibyl Labs Agent</span>
              </div>
              <p
                style={{
                  color: "#333333",
                  fontSize: "0.9rem",
                  marginTop: "2px",
                  fontWeight: 600,
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
            background: "#fef9c3",
            border: "2px solid #000000",
            boxShadow: "4px 4px 0px #000000",
            color: "#000000",
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
              fontSize: "0.95rem",
              fontWeight: 700,
            }}
          >
            <Sparkles size={20} style={{ color: "#000000" }} />
            <span>{notice}</span>
          </div>
          <button
            onClick={() => setNotice(null)}
            style={{
              background: "none",
              border: "none",
              color: "#000000",
              cursor: "pointer",
              fontWeight: 900,
              fontSize: "1.2rem",
            }}
          >
            &times;
          </button>
        </div>
      )}

      {/* GATE TESTING & ACTION BAR */}
      <section
        className="glass-panel"
        style={{
          padding: "20px 24px",
          marginBottom: "24px",
          background: "#ffffff",
        }}
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
                background: "#000000",
                color: "#ffffff",
                border: "2px solid #000000",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 900,
                fontSize: "0.95rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: isRebalancing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "3px 3px 0px #555555",
              }}
            >
              {isRebalancing ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <Zap size={18} />
              )}
              {isRebalancing ? "Rebalancing..." : "Run Autonomous Rebalance"}
            </button>

            <button
              onClick={handleColdStart}
              style={{
                background: "#ffffff",
                color: "#000000",
                border: "2px solid #000000",
                padding: "12px 20px",
                borderRadius: "6px",
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              <RefreshCw size={16} /> Cold-Start Recall Demo
            </button>

            <button
              onClick={handleTriggerX402}
              style={{
                background: "#e0f2fe",
                color: "#000000",
                border: "2px solid #000000",
                padding: "12px 20px",
                borderRadius: "6px",
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "3px 3px 0px #000000",
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
              background: "#f8f9fa",
              padding: "10px 18px",
              borderRadius: "6px",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 900,
                  color: "#000000",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Litmus Gate Test (Judges)
              </span>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: memoryEnabled ? "#15803d" : "#b91c1c",
                  fontWeight: 900,
                }}
              >
                {memoryEnabled
                  ? "Memory Layer: ACTIVE (Load-Bearing)"
                  : "Memory Layer: REMOVED (Gate Failure)"}
              </span>
            </div>

            <button
              onClick={() => handleToggleMemory(!memoryEnabled)}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 900,
                cursor: "pointer",
                border: "2px solid #000000",
                background: memoryEnabled ? "#fee2e2" : "#dcfce7",
                color: "#000000",
                boxShadow: "2px 2px 0px #000000",
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
          gap: "10px",
          marginBottom: "24px",
          borderBottom: "2px solid #000000",
          paddingBottom: "10px",
          flexWrap: "wrap",
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
                background: isActive ? "#000000" : "#ffffff",
                color: isActive ? "#ffffff" : "#000000",
                border: "2px solid #000000",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: 900,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: isActive
                  ? "3px 3px 0px #555555"
                  : "2px 2px 0px #000000",
                transition: "all 0.15s ease",
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
          <div
            className="glass-panel"
            style={{ padding: "24px", background: "#ffffff" }}
          >
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
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Cpu style={{ color: "#000000" }} size={22} /> Base Network
                Vault Portfolio
              </h3>
              <span className="badge badge-base">
                {status?.wallet_info?.chain}
              </span>
            </div>

            <div
              style={{
                marginBottom: "24px",
                background: "#f8f9fa",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #000000",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#555555",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontWeight: 700,
                }}
              >
                Wallet Address
              </p>
              <p
                className="font-mono"
                style={{
                  fontSize: "0.875rem",
                  color: "#000000",
                  marginTop: "4px",
                  fontWeight: 700,
                  wordBreak: "break-all",
                }}
              >
                {status?.wallet_info?.wallet_address}
              </p>
            </div>

            {/* TOKEN BALANCES */}
            <h4
              style={{
                fontSize: "1rem",
                fontWeight: 900,
                color: "#000000",
                marginBottom: "14px",
              }}
            >
              Onchain Balances & Target Allocation
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {Object.entries(status?.wallet_info?.balances || {}).map(
                ([token, amount]) => {
                  const price = status?.token_prices?.[token] || 1;
                  const valueUsd = amount * price;
                  return (
                    <div
                      key={token}
                      style={{
                        background: "#ffffff",
                        padding: "14px 18px",
                        borderRadius: "6px",
                        border: "2px solid #000000",
                        boxShadow: "2px 2px 0px #000000",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 900,
                            color: "#000000",
                            fontSize: "1.05rem",
                          }}
                        >
                          {token}
                        </span>
                        <span
                          className="font-mono"
                          style={{ color: "#000000", fontWeight: 700 }}
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
                          fontSize: "0.8rem",
                          color: "#555555",
                          fontWeight: 600,
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
          <div
            className="glass-panel"
            style={{ padding: "24px", background: "#ffffff" }}
          >
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
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Brain style={{ color: "#000000" }} size={22} /> gEEpEE
                Cognitive Terminal
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
                  color: "#555555",
                  background: "#f8f9fa",
                  borderRadius: "6px",
                  border: "2px solid #000000",
                }}
              >
                <Activity
                  size={40}
                  style={{ margin: "0 auto 12px", color: "#000000" }}
                />
                <p style={{ fontWeight: 700 }}>
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
                      background: "#fee2e2",
                      border: "2px solid #000000",
                      padding: "14px",
                      borderRadius: "6px",
                      color: "#000000",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#b91c1c",
                      }}
                    >
                      <AlertTriangle size={20} /> Rebalance Halted (Litmus Gate
                      Failure)
                    </div>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        marginTop: "6px",
                        fontWeight: 700,
                      }}
                    >
                      {rebalanceResult.error}
                    </p>
                  </div>
                )}

                {rebalanceResult.reasoning_steps?.map(
                  (step: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: "#f8f9fa",
                        padding: "12px 16px",
                        borderRadius: "6px",
                        border: "2px solid #000000",
                        borderLeft: "8px solid #000000",
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
                            fontWeight: 900,
                            color: "#000000",
                          }}
                        >
                          {step.step}
                        </span>
                        <span
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 900,
                            color: "#000000",
                          }}
                        >
                          {step.title}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#222222",
                          marginTop: "4px",
                          fontWeight: 600,
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
                      background: "#dcfce7",
                      border: "2px solid #000000",
                      padding: "14px",
                      borderRadius: "6px",
                    }}
                  >
                    <div
                      style={{
                        color: "#166534",
                        fontWeight: 900,
                        fontSize: "0.95rem",
                        marginBottom: "6px",
                      }}
                    >
                      Onchain Base Swap Verified
                    </div>
                    <p
                      className="font-mono"
                      style={{
                        fontSize: "0.85rem",
                        color: "#000000",
                        fontWeight: 700,
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
                        fontSize: "0.85rem",
                        color: "#0284c7",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        marginTop: "8px",
                        textDecoration: "none",
                        fontWeight: 900,
                      }}
                    >
                      View on Basescan <ExternalLink size={14} />
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
        <div
          className="glass-panel"
          style={{ padding: "24px", background: "#ffffff" }}
        >
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
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Database style={{ color: "#000000" }} size={24} /> Sibyl 5-Tier
                Memory Architecture Inspector
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#444444",
                  marginTop: "4px",
                  fontWeight: 600,
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
                    background: "#ffffff",
                    border: "2px solid #000000",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "6px",
                    color: "#000000",
                    fontSize: "0.9rem",
                    width: "240px",
                    fontWeight: 700,
                  }}
                />
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "12px",
                    color: "#000000",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                style={{
                  background: "#000000",
                  color: "#ffffff",
                  border: "2px solid #000000",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: 900,
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
                background: "#fef3c7",
                padding: "16px",
                borderRadius: "6px",
                marginBottom: "24px",
                border: "2px solid #000000",
              }}
            >
              <h4
                style={{
                  fontSize: "0.95rem",
                  color: "#000000",
                  marginBottom: "10px",
                  fontWeight: 900,
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
                      color: "#000000",
                      fontWeight: 600,
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
              borderBottom: "2px solid #000000",
              paddingBottom: "10px",
              flexWrap: "wrap",
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
                  background: memoryTierTab === t.id ? "#000000" : "#ffffff",
                  color: memoryTierTab === t.id ? "#ffffff" : "#000000",
                  border: "2px solid #000000",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: 900,
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
                    background: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "6px",
                    border: "2px solid #000000",
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
                      style={{
                        fontSize: "0.8rem",
                        color: "#555555",
                        fontWeight: 700,
                      }}
                    >
                      Updated: {ent.updated_at}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 900,
                      color: "#000000",
                      marginBottom: "8px",
                    }}
                  >
                    {ent.name}
                  </h4>
                  <pre
                    className="font-mono"
                    style={{
                      fontSize: "0.85rem",
                      color: "#000000",
                      background: "#ffffff",
                      padding: "12px",
                      borderRadius: "4px",
                      border: "1px solid #000000",
                      overflowX: "auto",
                      fontWeight: 600,
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
                    background: "#f8f9fa",
                    padding: "14px",
                    borderRadius: "6px",
                    border: "2px solid #000000",
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
                        fontWeight: 900,
                        color: "#000000",
                        fontSize: "0.95rem",
                      }}
                    >
                      {j.action}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#555555",
                        fontWeight: 700,
                      }}
                    >
                      {j.timestamp}
                    </span>
                  </div>
                  {j.tx_hash && (
                    <div
                      className="font-mono"
                      style={{
                        fontSize: "0.85rem",
                        color: "#0284c7",
                        marginTop: "4px",
                        fontWeight: 700,
                      }}
                    >
                      Tx Hash: {j.tx_hash}
                    </div>
                  )}
                  {j.details && (
                    <pre
                      className="font-mono"
                      style={{
                        fontSize: "0.8rem",
                        color: "#222222",
                        marginTop: "6px",
                        background: "#ffffff",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #000000",
                        fontWeight: 600,
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
                background: "#f8f9fa",
                padding: "16px",
                borderRadius: "6px",
                border: "2px solid #000000",
              }}
            >
              <h4
                style={{
                  fontSize: "1rem",
                  color: "#000000",
                  marginBottom: "8px",
                  fontWeight: 900,
                }}
              >
                HOT Working State (Active Locks & Working Memory)
              </h4>
              <pre
                className="font-mono"
                style={{
                  fontSize: "0.85rem",
                  color: "#000000",
                  background: "#ffffff",
                  padding: "14px",
                  borderRadius: "4px",
                  border: "1px solid #000000",
                  fontWeight: 600,
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
                        background: "#f8f9fa",
                        padding: "16px",
                        borderRadius: "6px",
                        border: "2px solid #000000",
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "1rem",
                          fontWeight: 900,
                          color: "#000000",
                          marginBottom: "4px",
                        }}
                      >
                        {doc.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#222222",
                          marginTop: "6px",
                          fontWeight: 600,
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
          style={{
            padding: "24px",
            maxWidth: "800px",
            margin: "0 auto",
            background: "#ffffff",
          }}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "#000000",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sliders style={{ color: "#000000" }} size={24} /> Configure Target
            Strategy & Risk Rules
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#444444",
              marginBottom: "24px",
              fontWeight: 600,
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
                    color: "#000000",
                    marginBottom: "6px",
                    fontWeight: 900,
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
                    background: "#ffffff",
                    border: "2px solid #000000",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#000000",
                    fontWeight: 800,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#000000",
                    marginBottom: "6px",
                    fontWeight: 900,
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
                    background: "#ffffff",
                    border: "2px solid #000000",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#000000",
                    fontWeight: 800,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#000000",
                    marginBottom: "6px",
                    fontWeight: 900,
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
                    background: "#ffffff",
                    border: "2px solid #000000",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#000000",
                    fontWeight: 800,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    color: "#000000",
                    marginBottom: "6px",
                    fontWeight: 900,
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
                    background: "#ffffff",
                    border: "2px solid #000000",
                    padding: "10px",
                    borderRadius: "6px",
                    color: "#000000",
                    fontWeight: 800,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#000000",
                  marginBottom: "6px",
                  fontWeight: 900,
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
                  background: "#ffffff",
                  border: "2px solid #000000",
                  padding: "10px",
                  borderRadius: "6px",
                  color: "#000000",
                  fontWeight: 800,
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: "#000000",
                color: "#ffffff",
                border: "2px solid #000000",
                padding: "12px 24px",
                borderRadius: "6px",
                fontWeight: 900,
                fontSize: "0.95rem",
                cursor: "pointer",
                marginTop: "12px",
                boxShadow: "3px 3px 0px #555555",
              }}
            >
              Save Strategy to Sibyl Memory
            </button>
          </form>
        </div>
      )}

      {/* TAB CONTENT 4: VIRTUALS ACP PROTOCOL */}
      {activeTab === "acp" && (
        <div
          className="glass-panel"
          style={{ padding: "24px", background: "#ffffff" }}
        >
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "#000000",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Radio style={{ color: "#6b21a8" }} size={24} /> Virtuals Protocol
            Agent Communication Protocol (ACP)
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#444444",
              marginBottom: "24px",
              fontWeight: 600,
            }}
          >
            gEEpEE broadcasts inter-agent signals to partner agents on the
            Virtuals ACP network.
          </p>

          <div
            style={{
              background: "#f3e8ff",
              padding: "18px",
              borderRadius: "6px",
              marginBottom: "24px",
              border: "2px solid #000000",
            }}
          >
            <h4
              style={{
                color: "#6b21a8",
                fontSize: "1rem",
                marginBottom: "8px",
                fontWeight: 900,
              }}
            >
              Registered Virtuals Agent Metadata
            </h4>
            <pre
              className="font-mono"
              style={{
                fontSize: "0.85rem",
                color: "#000000",
                background: "#ffffff",
                padding: "12px",
                borderRadius: "4px",
                border: "1px solid #000000",
                fontWeight: 600,
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
