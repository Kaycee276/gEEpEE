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
      style={{ padding: "10px 16px", background: "#ffffff", flexShrink: 0 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "12px",
        }}
      >
        {/* PRIMARY ACTIONS */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={onRunRebalance}
            disabled={isRebalancing}
            className="neo-btn neo-btn-yellow"
          >
            {isRebalancing ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Zap size={16} />
            )}
            {isRebalancing ? "Rebalancing..." : "Run Autonomous Rebalance"}
          </button>

          <button onClick={onColdStart} className="neo-btn neo-btn-white">
            <RefreshCw size={14} /> Cold-Start Recall Demo
          </button>

          <button onClick={onTriggerX402} className="neo-btn neo-btn-cyan">
            <DollarSign size={14} /> Test Base x402 Header
          </button>
        </div>

        {/* LITMUS GATE TEST SWITCH */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: memoryEnabled
              ? "var(--neo-green-light)"
              : "var(--neo-red-light)",
            padding: "6px 12px",
            border: "2px solid #000000",
            boxShadow: "2px 2px 0px #000000",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 900,
                color: "#000000",
                textTransform: "uppercase",
              }}
            >
              Litmus Gate Test
            </span>
            <span
              style={{ fontSize: "0.78rem", color: "#000000", fontWeight: 900 }}
            >
              {memoryEnabled
                ? "Memory: LOAD-BEARING"
                : "Memory: REMOVED (Gate Failure)"}
            </span>
          </div>

          <button
            onClick={() => onToggleMemory(!memoryEnabled)}
            className={`neo-btn ${memoryEnabled ? "neo-btn-red" : "neo-btn-green"}`}
            style={{ padding: "4px 8px", fontSize: "0.75rem" }}
          >
            {memoryEnabled ? "Delete Memory" : "Restore Memory"}
          </button>
        </div>
      </div>
    </section>
  );
};
