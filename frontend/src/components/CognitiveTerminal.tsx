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
          <Brain style={{ color: "#000000" }} size={22} /> gEEpEE Cognitive
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
            color: "#555555",
            background: "#f8f9fa",
            borderRadius: "6px",
            border: "2px solid #000000",
          }}
        >
          <Activity
            size={40}
            style={{ margin: "0 auto 12px", color: "#000000" }}
          />
          <p style={{ fontWeight: 700 }}>
            Click "Run Autonomous Rebalance" above to observe gEEpEE's memory
            recall & Base onchain execution workflow.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {rebalanceResult.error && (
            <div
              style={{
                background: "#fee2e2",
                border: "2px solid #000000",
                padding: "14px",
                borderRadius: "6px",
                color: "#000000",
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#b91c1c",
                }}
              >
                <AlertTriangle size={20} /> Rebalance Halted (Litmus Gate
                Failure)
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
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
                background: "#f8f9fa",
                padding: "12px 16px",
                borderRadius: "6px",
                border: "2px solid #000000",
                borderLeft: "8px solid #000000",
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
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    color: "#000000",
                  }}
                >
                  {step.step}
                </span>
                <span
                  style={{
                    fontSize: "0.9rem",
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
                  marginTop: "4px",
                  fontWeight: 600,
                }}
              >
                {step.detail}
              </p>
            </div>
          ))}

          {rebalanceResult.executed_swap && (
            <div
              style={{
                background: "#dcfce7",
                border: "2px solid #000000",
                padding: "14px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  color: "#166534",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  marginBottom: "6px",
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
                  color: "#0284c7",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "8px",
                  textDecoration: "none",
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
