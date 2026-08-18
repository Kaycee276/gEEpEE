import React from "react";
import { FileText, Cpu, Radio, Shield, Zap } from "lucide-react";
import type { StatusData } from "../types";

interface DocsPanelProps {
  status: StatusData | null;
}

export const DocsPanel: React.FC<DocsPanelProps> = ({ status }) => {
  return (
    <div
      className="neo-card"
      style={{
        padding: "20px",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          flexShrink: 0,
        }}
      >
        <h3
          className="neo-title"
          style={{
            fontSize: "1.2rem",
            color: "#000000",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            margin: 0,
          }}
        >
          <FileText style={{ color: "#000000" }} size={22} /> System
          Documentation & Partner Architecture
        </h3>
        <span className="badge badge-sibyl">gEEpEE v1.0.0</span>
      </div>

      <div
        className="scrollable-internal"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          paddingRight: "4px",
        }}
      >
        {/* LITMUS GATE DIRECTIVE */}
        <div
          style={{
            background: "var(--neo-yellow-light)",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
            padding: "14px",
          }}
        >
          <h4
            className="neo-title"
            style={{
              fontSize: "1rem",
              color: "#000000",
              marginBottom: "6px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Shield size={18} /> Hackathon Gate Verification (Litmus Test)
          </h4>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#000000",
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            gEEpEE explicitly enforces load-bearing memory. Code path located in{" "}
            <code>backend/agent_brain.py</code> lines 32–55. When load-bearing
            memory is deleted,{" "}
            <code>get_entity("user_strategy", "default_profile")</code> returns{" "}
            <code>None</code>, causing <code>run_rebalance_cycle()</code> to
            safely halt with{" "}
            <code>GATE FAILURE: Load-bearing memory missing</code>.
          </p>
        </div>

        {/* PARTNER STACK BREAKDOWN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <div
            style={{
              background: "var(--neo-cyan-light)",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              padding: "14px",
            }}
          >
            <h4
              className="neo-title"
              style={{
                fontSize: "0.95rem",
                color: "#000000",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Cpu size={16} /> Base Network Stack Integration
            </h4>
            <ul
              style={{
                fontSize: "0.8rem",
                color: "#000000",
                fontWeight: 700,
                paddingLeft: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <li>Base Chain ID: 8453 (Sepolia: 84532)</li>
              <li>DEX Router: Aerodrome / Uniswap V3 on Base</li>
              <li>x402 Payment Header: Sub-cent USDC oracle feeds</li>
              <li>Gas Cost: ~$0.0012 sub-cent Layer-2 execution</li>
            </ul>
          </div>

          <div
            style={{
              background: "var(--neo-purple-light)",
              border: "2px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              padding: "14px",
            }}
          >
            <h4
              className="neo-title"
              style={{
                fontSize: "0.95rem",
                color: "#000000",
                marginBottom: "6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Radio size={16} /> Virtuals Protocol ACP Integration
            </h4>
            <ul
              style={{
                fontSize: "0.8rem",
                color: "#000000",
                fontWeight: 700,
                paddingLeft: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <li>Agent ID: {status?.virtuals_registry?.agent_id}</li>
              <li>Protocol: Agent Communication Protocol (ACP)</li>
              <li>
                Reputation Score: {status?.virtuals_registry?.reputation_score}{" "}
                / 100
              </li>
              <li>Signed ACP Job Signals emitted to partner agents</li>
            </ul>
          </div>
        </div>

        {/* SYSTEM ENGINE STATS */}
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
            padding: "14px",
          }}
        >
          <h4
            className="neo-title"
            style={{
              fontSize: "0.95rem",
              color: "#000000",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Zap size={16} /> Sibyl 5-Tier Memory Stats
          </h4>
          <pre
            className="font-mono"
            style={{
              fontSize: "0.8rem",
              color: "#000000",
              background: "var(--neo-bg)",
              padding: "10px",
              border: "2px solid #000000",
              fontWeight: 700,
            }}
          >
            {JSON.stringify(status?.memory_stats, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
