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
        padding: "12px 18px",
        background: "var(--neo-yellow)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.png"
            alt="gEEpEE Monogram Logo"
            style={{
              width: "42px",
              height: "42px",
              border: "2px solid #000000",
              boxShadow: "2px 2px 0px #000000",
              objectFit: "contain",
              background: "transparent",
            }}
          />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h1
                className="neo-title"
                style={{
                  fontSize: "1.6rem",
                  color: "#000000",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                gEEpEE
              </h1>
              <span className="badge badge-virtuals">Sibyl Labs Agent</span>
            </div>
            <p
              style={{
                color: "#000000",
                fontSize: "0.8rem",
                marginTop: "1px",
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
            gap: "8px",
            flexWrap: "nowrap",
          }}
        >
          <div className="badge badge-base">
            <Cpu size={12} /> Base Mainnet (8453)
          </div>
          <div className="badge badge-virtuals">
            <Radio size={12} /> Virtuals ACP Active
          </div>
          <div
            className={`badge ${memoryEnabled ? "badge-success" : "badge-danger"}`}
          >
            <Database size={12} /> SQLite 5-Tier (
            {status?.memory_stats?.db_size_kb || 0} KB)
          </div>
        </div>
      </div>
    </header>
  );
};
