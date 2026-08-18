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
      className="glass-panel"
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
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onRunRebalance}
            disabled={isRebalancing}
            style={{
              background: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              padding: "12px 24px",
              borderRadius: "6px",
              fontWeight: 900,
              fontSize: "0.95rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: isRebalancing ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "3px 3px 0px #555555",
            }}
          >
            {isRebalancing ? (
              <RefreshCw className="animate-spin" size={18} />
            ) : (
              <Zap size={18} />
            )}
            {isRebalancing ? "Rebalancing..." : "Run Autonomous Rebalance"}
          </button>

          <button
            onClick={onColdStart}
            style={{
              background: "#ffffff",
              color: "#000000",
              border: "2px solid #000000",
              padding: "12px 20px",
              borderRadius: "6px",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            <RefreshCw size={16} /> Cold-Start Recall Demo
          </button>

          <button
            onClick={onTriggerX402}
            style={{
              background: "#e0f2fe",
              color: "#000000",
              border: "2px solid #000000",
              padding: "12px 20px",
              borderRadius: "6px",
              fontWeight: 800,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            <DollarSign size={16} /> Test Base x402 Header
          </button>
        </div>

        {/* LITMUS GATE TEST SWITCH */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "#f8f9fa",
            padding: "10px 18px",
            borderRadius: "6px",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
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
              style={{
                fontSize: "0.85rem",
                color: memoryEnabled ? "#15803d" : "#b91c1c",
                fontWeight: 900,
              }}
            >
              {memoryEnabled
                ? "Memory Layer: ACTIVE (Load-Bearing)"
                : "Memory Layer: REMOVED (Gate Failure)"}
            </span>
          </div>

          <button
            onClick={() => onToggleMemory(!memoryEnabled)}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: 900,
              cursor: "pointer",
              border: "2px solid #000000",
              background: memoryEnabled ? "#fee2e2" : "#dcfce7",
              color: "#000000",
              boxShadow: "2px 2px 0px #000000",
            }}
          >
            {memoryEnabled ? "Simulate Delete Memory" : "Restore Memory"}
          </button>
        </div>
      </div>
    </section>
  );
};
