import React from "react";
import { Cpu, Radio, Database } from "lucide-react";
import type { StatusData } from "../types";

interface HeaderProps {
  status: StatusData | null;
  memoryEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, memoryEnabled }) => {
  return (
    <header
      className="neo-card"
      style={{
        padding: "20px 24px",
        marginBottom: "24px",
        background: "var(--neo-yellow)",
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
          <img
            src="/logo.jpg"
            alt="gEEpEE Logo"
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "4px",
              border: "3px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              objectFit: "cover",
            }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1
                className="neo-title"
                style={{ fontSize: "2.2rem", color: "#000000", margin: 0 }}
              >
                gEEpEE
              </h1>
              <span className="badge badge-virtuals">Sibyl Labs Agent</span>
            </div>
            <p
              style={{
                color: "#000000",
                fontSize: "0.95rem",
                marginTop: "2px",
                fontWeight: 700,
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
            gap: "12px",
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
