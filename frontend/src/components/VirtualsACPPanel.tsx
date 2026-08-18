import React from "react";
import { Radio } from "lucide-react";
import type { StatusData } from "../types";

interface VirtualsACPPanelProps {
  status: StatusData | null;
}

export const VirtualsACPPanel: React.FC<VirtualsACPPanelProps> = ({
  status,
}) => {
  return (
    <div
      className="glass-panel"
      style={{ padding: "24px", background: "#ffffff" }}
    >
      <h3
        style={{
          fontSize: "1.3rem",
          fontWeight: 900,
          color: "#000000",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Radio style={{ color: "#6b21a8" }} size={24} /> Virtuals Protocol Agent
        Communication Protocol (ACP)
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#444444",
          marginBottom: "24px",
          fontWeight: 600,
        }}
      >
        gEEpEE broadcasts inter-agent signals to partner agents on the Virtuals
        ACP network.
      </p>

      <div
        style={{
          background: "#f3e8ff",
          padding: "18px",
          borderRadius: "6px",
          marginBottom: "24px",
          border: "2px solid #000000",
        }}
      >
        <h4
          style={{
            color: "#6b21a8",
            fontSize: "1rem",
            marginBottom: "8px",
            fontWeight: 900,
          }}
        >
          Registered Virtuals Agent Metadata
        </h4>
        <pre
          className="font-mono"
          style={{
            fontSize: "0.85rem",
            color: "#000000",
            background: "#ffffff",
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #000000",
            fontWeight: 600,
          }}
        >
          {JSON.stringify(status?.virtuals_registry, null, 2)}
        </pre>
      </div>
    </div>
  );
};
