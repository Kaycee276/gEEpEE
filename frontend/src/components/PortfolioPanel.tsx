import React from "react";
import { useAccount, useChainId } from "wagmi";
import type { StatusData } from "../types";
import { SkeletonLoader } from "./SkeletonLoader";

interface PortfolioPanelProps {
  status: StatusData | null;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ status }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  if (!status) {
    return (
      <div
        className="neo-card"
        style={{ padding: "16px", background: "#ffffff" }}
      >
        <h3
          className="neo-title"
          style={{ fontSize: "1.1rem", color: "#000000", marginBottom: "14px" }}
        >
          Base Network Vault Portfolio
        </h3>
        <SkeletonLoader count={4} height="50px" />
      </div>
    );
  }

  // When wallet is disconnected, show clean disconnected lock banner
  if (!isConnected || !address) {
    return (
      <div
        className="neo-card"
        style={{ padding: "20px", background: "#ffffff" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div>
            <h3
              className="neo-title"
              style={{ fontSize: "1.1rem", color: "#000000", margin: 0 }}
            >
              Base Network Vault Portfolio
            </h3>
            <p
              style={{
                fontSize: "0.72rem",
                color: "#555555",
                fontWeight: 700,
                marginTop: "2px",
              }}
            >
              Data: Live Base L2 token balances and connected wallet portfolio
              valuations.
            </p>
          </div>
          <span className="badge badge-warning">Wallet Disconnected</span>
        </div>

        <div
          style={{
            background: "var(--neo-yellow-light)",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <h4
            style={{
              fontSize: "0.95rem",
              fontWeight: 900,
              color: "#000000",
              margin: 0,
              textTransform: "uppercase",
            }}
          >
            Wallet Not Connected
          </h4>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#333333",
              fontWeight: 700,
              marginTop: "6px",
              marginBottom: 0,
            }}
          >
            Please click <strong>"Connect Wallet"</strong> in the top header to
            connect your Base Web3 wallet and view your portfolio balances.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="neo-card"
      style={{ padding: "16px", background: "#ffffff" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div>
          <h3
            className="neo-title"
            style={{ fontSize: "1.1rem", color: "#000000", margin: 0 }}
          >
            Base Network Vault Portfolio
          </h3>
          <p
            style={{
              fontSize: "0.72rem",
              color: "#555555",
              fontWeight: 700,
              marginTop: "2px",
            }}
          >
            Data: Live Base L2 token balances, USD valuations, and active Web3
            wallet address.
          </p>
        </div>
        <span className="badge badge-base">Base L2 (Chain ID {chainId})</span>
      </div>

      <div
        style={{
          marginBottom: "16px",
          background: "var(--neo-green-light)",
          padding: "10px 12px",
          border: "2px solid #000000",
          boxShadow: "2px 2px 0px #000000",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              color: "#000000",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 900,
              margin: 0,
            }}
          >
            Connected Wallet Address
          </p>
          <span className="badge badge-success" style={{ fontSize: "0.65rem" }}>
            Live Web3
          </span>
        </div>
        <p
          className="font-mono"
          style={{
            fontSize: "0.82rem",
            color: "#000000",
            marginTop: "4px",
            fontWeight: 900,
            wordBreak: "break-all",
            margin: "4px 0 0 0",
          }}
        >
          {address}
        </p>
      </div>

      {/* TOKEN BALANCES */}
      <h4
        style={{
          fontSize: "0.88rem",
          fontWeight: 900,
          color: "#000000",
          marginBottom: "10px",
          textTransform: "uppercase",
        }}
      >
        Onchain Balances & Target Allocation
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
