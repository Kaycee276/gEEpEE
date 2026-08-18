import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Radio, Database } from "lucide-react";
import type { StatusData } from "../types";

interface HeaderProps {
  status: StatusData | null;
  memoryEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, memoryEnabled }) => {
  return (
    <header
      className="neo-card"
      style={{ padding: "18px 24px", background: "var(--neo-yellow)" }}
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
            src="/logo.png"
            alt="gEEpEE Monogram Logo"
            style={{
              width: "56px",
              height: "56px",
              border: "3px solid #000000",
              boxShadow: "3px 3px 0px #000000",
              objectFit: "contain",
              background: "transparent",
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

        {/* CONNECT WALLET & NETWORK BADGES */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div className="badge badge-virtuals">
            <Radio size={14} /> Virtuals ACP Active
          </div>
          <div
            className={`badge ${memoryEnabled ? "badge-success" : "badge-danger"}`}
          >
            <Database size={14} /> SQLite 5-Tier (
            {status?.memory_stats?.db_size_kb || 0} KB)
          </div>

          {/* RAINBOWKIT CONNECT WALLET & CHAIN SWITCHER BUTTON */}
          <ConnectButton
            accountStatus="avatar"
            chainStatus="full"
            showBalance={true}
          />
        </div>
      </div>
    </header>
  );
};
