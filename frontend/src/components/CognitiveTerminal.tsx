import React from "react";
import { Brain, Activity, AlertTriangle, ExternalLink } from "lucide-react";
import type { RebalanceResult } from "../types";

interface CognitiveTerminalProps {
  rebalanceResult: RebalanceResult | null;
}

export const CognitiveTerminal: React.FC<CognitiveTerminalProps> = ({
  rebalanceResult,
}) => {
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
          <Brain style={{ color: "#000000" }} size={24} /> gEEpEE Cognitive
          Terminal
        </h3>
        <span
          className={`badge ${rebalanceResult?.memory_used ? "badge-success" : "badge-danger"}`}
        >
          {rebalanceResult
            ? rebalanceResult.gate_status
            : "Ready for Rebalance"}
        </span>
      </div>

      {!rebalanceResult ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#000000",
            background: "var(--neo-yellow-light)",
            border: "3px solid #000000",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <Activity
            size={40}
            style={{ margin: "0 auto 12px", color: "#000000" }}
          />
          <p style={{ fontWeight: 900, fontSize: "0.95rem" }}>
            Click "Run Autonomous Rebalance" above to observe gEEpEE's memory
            recall & Base onchain execution workflow.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {rebalanceResult.error && (
            <div
              style={{
                background: "var(--neo-red-light)",
                border: "3px solid #000000",
                boxShadow: "4px 4px 0px #000000",
                padding: "14px",
                color: "#000000",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#000000",
                  fontSize: "1rem",
                }}
              >
                <AlertTriangle size={20} /> Rebalance Halted (Litmus Gate
                Failure)
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  marginTop: "6px",
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
                padding: "14px 16px",
                border: "3px solid #000000",
                boxShadow: "3px 3px 0px #000000",
                borderLeft: "10px solid #000000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <span className="badge badge-sibyl">{step.step}</span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 900,
                    color: "#000000",
                  }}
                >
                  {step.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#222222",
                  marginTop: "6px",
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
                border: "3px solid #000000",
                boxShadow: "4px 4px 0px #000000",
                padding: "14px",
              }}
            >
              <div
                style={{
                  color: "#000000",
                  fontWeight: 900,
                  fontSize: "1rem",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Onchain Base Swap Verified
              </div>
              <p
                className="font-mono"
                style={{
                  fontSize: "0.85rem",
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
                  fontSize: "0.85rem",
                  color: "#000000",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "8px",
                  textDecoration: "underline",
                  fontWeight: 900,
                }}
              >
                View on Basescan <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
