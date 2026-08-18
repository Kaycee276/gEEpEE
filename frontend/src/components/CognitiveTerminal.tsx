import React from "react";
import type { RebalanceResult } from "../types";
import { SkeletonLoader } from "./SkeletonLoader";

interface CognitiveTerminalProps {
  rebalanceResult: RebalanceResult | null;
  isRebalancing?: boolean;
}

export const CognitiveTerminal: React.FC<CognitiveTerminalProps> = ({
  rebalanceResult,
  isRebalancing,
}) => {
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
            gEEpEE Cognitive Terminal
          </h3>
          <p
            style={{
              fontSize: "0.72rem",
              color: "#555555",
              fontWeight: 700,
              marginTop: "2px",
            }}
          >
            Data: Step-by-step AI cognitive reasoning log, Litmus Gate checks,
            and onchain Base transaction verification.
          </p>
        </div>
        <span
          className={`badge ${rebalanceResult?.memory_used ? "badge-success" : "badge-danger"}`}
        >
          {rebalanceResult
            ? rebalanceResult.gate_status
            : "Ready for Rebalance"}
        </span>
      </div>

      {isRebalancing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 900, color: "#000000" }}>
            Executing Memory Recall & Base DEX Swap...
          </p>
          <SkeletonLoader count={4} height="52px" />
        </div>
      ) : !rebalanceResult ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px 14px",
            color: "#000000",
            background: "var(--neo-yellow-light)",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
          }}
        >
          <p style={{ fontWeight: 900, fontSize: "0.85rem" }}>
            Click "Run Rebalance" above to observe gEEpEE's memory recall & Base
            onchain execution workflow.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {rebalanceResult.error && (
            <div
              style={{
                background: "var(--neo-red-light)",
                border: "2px solid #000000",
                boxShadow: "3px 3px 0px #000000",
                padding: "10px 12px",
                color: "#000000",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  color: "#000000",
                  fontSize: "0.88rem",
                }}
              >
                ⚠️ Rebalance Halted (Litmus Gate Failure)
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  marginTop: "4px",
                  fontWeight: 700,
                }}
              >
                {rebalanceResult.error}
              </p>
            </div>
          )}

          {rebalanceResult.reasoning_steps?.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: "10px 12px",
                border: "2px solid #000000",
                boxShadow: "2px 2px 0px #000000",
                borderLeft: "8px solid #000000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2px",
                }}
              >
                <span className="badge badge-sibyl">{step.step}</span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 900,
                    color: "#000000",
                  }}
                >
                  {step.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#222222",
                  marginTop: "4px",
                  fontWeight: 700,
                }}
              >
                {step.detail}
              </p>
            </div>
          ))}

          {rebalanceResult.executed_swap && (
            <div
              style={{
                background: "var(--neo-green-light)",
                border: "2px solid #000000",
                boxShadow: "3px 3px 0px #000000",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: "0.88rem",
                  marginBottom: "4px",
                  textTransform: "uppercase",
                }}
              >
                Onchain Base Swap Verified
              </div>
              <p
                className="font-mono"
                style={{
                  fontSize: "0.78rem",
                  color: "#000000",
                  fontWeight: 700,
                  wordBreak: "break-all",
                }}
              >
                Tx Hash: {rebalanceResult.executed_swap.tx_hash}
              </p>
              <a
                href={rebalanceResult.executed_swap.explorer_url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "0.78rem",
                  color: "#000000",
                  display: "inline-block",
                  marginTop: "4px",
                  textDecoration: "underline",
                  fontWeight: 900,
                }}
              >
                View on Basescan ↗
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
