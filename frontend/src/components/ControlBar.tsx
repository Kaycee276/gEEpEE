import React from "react";
import { Zap, RefreshCw, DollarSign } from "lucide-react";

interface ControlBarProps {
  isRebalancing: boolean;
  memoryEnabled: boolean;
  onRunRebalance: () => void;
  onColdStart: () => void;
  onTriggerX402: () => void;
  onToggleMemory: (enabled: boolean) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRebalancing,
  memoryEnabled,
  onRunRebalance,
  onColdStart,
  onTriggerX402,
  onToggleMemory,
}) => {
  return (
    <section
      className="neo-card"
      style={{
        padding: "20px 24px",
        marginBottom: "24px",
        background: "#ffffff",
      }}
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
        {/* PRIMARY ACTIONS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onRunRebalance}
            disabled={isRebalancing}
            className="neo-btn neo-btn-yellow"
          >
            {isRebalancing ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <Zap size={18} />
            )}
            {isRebalancing ? "Rebalancing..." : "Run Autonomous Rebalance"}
          </button>

          <button onClick={onColdStart} className="neo-btn neo-btn-white">
            <RefreshCw size={16} /> Cold-Start Recall Demo
          </button>

          <button onClick={onTriggerX402} className="neo-btn neo-btn-cyan">
            <DollarSign size={16} /> Test Base x402 Header
          </button>
        </div>

        {/* LITMUS GATE TEST SWITCH */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: memoryEnabled
              ? "var(--neo-green-light)"
              : "var(--neo-red-light)",
            padding: "12px 18px",
            borderRadius: "0px",
            border: "3px solid #000000",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 900,
                color: "#000000",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Litmus Gate Test (Judges)
            </span>
            <span
              style={{ fontSize: "0.85rem", color: "#000000", fontWeight: 900 }}
            >
              {memoryEnabled
                ? "Memory Layer: ACTIVE (Load-Bearing)"
                : "Memory Layer: REMOVED (Gate Failure)"}
            </span>
          </div>

          <button
            onClick={() => onToggleMemory(!memoryEnabled)}
            className={`neo-btn ${memoryEnabled ? "neo-btn-red" : "neo-btn-green"}`}
            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
          >
            {memoryEnabled ? "Delete Memory" : "Restore Memory"}
          </button>
        </div>
      </div>
    </section>
  );
};
