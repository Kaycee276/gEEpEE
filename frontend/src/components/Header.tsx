import React from "react";
import { Brain, Cpu, Radio, Database } from "lucide-react";
import type { StatusData } from "../types";

interface HeaderProps {
  status: StatusData | null;
  memoryEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, memoryEnabled }) => {
  return (
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
  );
};
