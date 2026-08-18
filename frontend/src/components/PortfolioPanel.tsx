import React from "react";
import { Cpu } from "lucide-react";
import type { StatusData } from "../types";

interface PortfolioPanelProps {
  status: StatusData | null;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ status }) => {
  return (
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
          <Cpu style={{ color: "#000000" }} size={22} /> Base Network Vault
          Portfolio
        </h3>
        <span className="badge badge-base">{status?.wallet_info?.chain}</span>
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
  );
};
