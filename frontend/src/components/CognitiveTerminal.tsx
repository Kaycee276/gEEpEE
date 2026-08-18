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
          <Brain style={{ color: "#000000" }} size={20} /> gEEpEE Cognitive
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
            padding: "30px 16px",
            color: "#000000",
            background: "var(--neo-yellow-light)",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
            margin: "auto 0",
          }}
        >
          <Activity
            size={32}
            style={{ margin: "0 auto 8px", color: "#000000" }}
          />
          <p style={{ fontWeight: 900, fontSize: "0.85rem" }}>
            Click "Run Autonomous Rebalance" above to observe gEEpEE's memory
            recall & Base onchain execution workflow.
          </p>
        </div>
      ) : (
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
          {rebalanceResult.error && (
            <div
              style={{
                background: "var(--neo-red-light)",
                border: "2px solid #000000",
                boxShadow: "3px 3px 0px #000000",
                padding: "10px 12px",
                color: "#000000",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#000000",
                  fontSize: "0.88rem",
                }}
              >
                <AlertTriangle size={18} /> Rebalance Halted (Litmus Gate
                Failure)
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
                flexShrink: 0,
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
                flexShrink: 0,
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "4px",
                  textDecoration: "underline",
                  fontWeight: 900,
                }}
              >
                View on Basescan <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
