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
      className="neo-card"
      style={{ padding: "28px", background: "#ffffff" }}
    >
      <h3
        className="neo-title"
        style={{
          fontSize: "1.4rem",
          color: "#000000",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Radio style={{ color: "#000000" }} size={26} /> Virtuals Protocol Agent
        Communication Protocol (ACP)
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#333333",
          marginBottom: "24px",
          fontWeight: 700,
        }}
      >
        gEEpEE broadcasts inter-agent signals to partner agents on the Virtuals
        ACP network.
      </p>

      <div
        style={{
          background: "var(--neo-purple-light)",
          padding: "20px",
          borderRadius: "4px",
          marginBottom: "24px",
          border: "3px solid #000000",
          boxShadow: "4px 4px 0px #000000",
        }}
      >
        <h4
          className="neo-title"
          style={{ color: "#000000", fontSize: "1.1rem", marginBottom: "10px" }}
        >
          Registered Virtuals Agent Metadata
        </h4>
        <pre
          className="font-mono"
          style={{
            fontSize: "0.85rem",
            color: "#000000",
            background: "#ffffff",
            padding: "14px",
            borderRadius: "4px",
            border: "2px solid #000000",
            fontWeight: 700,
          }}
        >
          {JSON.stringify(status?.virtuals_registry, null, 2)}
        </pre>
      </div>
    </div>
  );
};
