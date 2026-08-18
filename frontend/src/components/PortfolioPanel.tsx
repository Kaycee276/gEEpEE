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
          className="neo-title"
          style={{
            fontSize: "1.3rem",
            color: "#000000",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
          }}
        >
          <Cpu style={{ color: "#000000" }} size={24} /> Base Network Vault
          Portfolio
        </h3>
        <span className="badge badge-base">{status?.wallet_info?.chain}</span>
      </div>

      <div
        style={{
          marginBottom: "24px",
          background: "var(--neo-cyan-light)",
          padding: "14px",
          border: "2px solid #000000",
          boxShadow: "3px 3px 0px #000000",
        }}
      >
        <p
          style={{
            fontSize: "0.8rem",
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
            fontSize: "0.9rem",
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
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Onchain Balances & Target Allocation
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
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
                  border: "3px solid #000000",
                  boxShadow: "4px 4px 0px #000000",
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
                    className="neo-title"
                    style={{ color: "#000000", fontSize: "1.1rem" }}
                  >
                    {token}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      color: "#000000",
                      fontWeight: 900,
                      fontSize: "0.95rem",
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
                    fontSize: "0.8rem",
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
