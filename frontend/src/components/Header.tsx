import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { StatusData } from "../types";

interface HeaderProps {
  status: StatusData | null;
  memoryEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ memoryEnabled }) => {
  return (
    <header
      className="neo-card"
      style={{ padding: "10px 16px", background: "var(--neo-yellow)" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* BRAND LOGO & TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/logo.png"
            alt="gEEpEE Monogram Logo"
            style={{
              width: "40px",
              height: "40px",
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
                  fontSize: "1.5rem",
                  color: "#000000",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                gEEpEE
              </h1>
              <span
                className="badge badge-virtuals"
                style={{ fontSize: "0.68rem", padding: "1px 5px" }}
              >
                Sibyl Agent
              </span>
            </div>
            <p
              style={{
                color: "#000000",
                fontSize: "0.78rem",
                marginTop: "1px",
                fontWeight: 700,
              }}
            >
              Autonomous Memory-Driven Onchain Vault Agent on Base
            </p>
          </div>
        </div>

        {/* MINIMIZED WEB3 & SYSTEM STATUS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            className={`badge ${memoryEnabled ? "badge-success" : "badge-danger"}`}
            style={{ fontSize: "0.7rem" }}
          >
            {memoryEnabled ? "Sibyl Memory Active" : "Memory Offline"}
          </span>

          {/* COMPACT RAINBOWKIT CONNECT WALLET BUTTON */}
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  );
};
