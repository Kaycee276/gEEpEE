import React from "react";
import { Cpu } from "lucide-react";
import type { StatusData } from "../types";

interface PortfolioPanelProps {
  status: StatusData | null;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ status }) => {
  return (
    <div
      className="neo-card"
      style={{
        padding: "16px",
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
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        <h3
          className="neo-title"
          style={{
            fontSize: "1.1rem",
            color: "#000000",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            margin: 0,
          }}
        >
          <Cpu style={{ color: "#000000" }} size={20} /> Base Network Vault
          Portfolio
        </h3>
        <span className="badge badge-base">{status?.wallet_info?.chain}</span>
      </div>

      <div
        style={{
          marginBottom: "12px",
          background: "var(--neo-cyan-light)",
          padding: "10px 12px",
          border: "2px solid #000000",
          boxShadow: "2px 2px 0px #000000",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            color: "#000000",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 900,
          }}
        >
          Wallet Address
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: "0.8rem",
            color: "#000000",
            marginTop: "2px",
            fontWeight: 700,
            wordBreak: "break-all",
          }}
        >
          {status?.wallet_info?.wallet_address}
        </p>
      </div>

      {/* TOKEN BALANCES INTERNAL SCROLL CONTAINER */}
      <h4
        style={{
          fontSize: "0.85rem",
          fontWeight: 900,
          color: "#000000",
          marginBottom: "8px",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        Onchain Balances & Allocation
      </h4>

      <div
        className="scrollable-internal"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          paddingRight: "4px",
        }}
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
                  padding: "10px 14px",
                  border: "2px solid #000000",
                  boxShadow: "3px 3px 0px #000000",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    className="neo-title"
                    style={{ color: "#000000", fontSize: "1rem" }}
                  >
                    {token}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      color: "#000000",
                      fontWeight: 900,
                      fontSize: "0.85rem",
                    }}
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
                    color: "#333333",
                    fontWeight: 700,
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
  );
};
