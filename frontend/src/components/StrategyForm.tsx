import React, { useState } from "react";
import { Sliders } from "lucide-react";

interface StrategyFormProps {
  onSaveStrategy: (payload: {
    user_name: string;
    risk_tolerance: string;
    target_allocation: Record<string, number>;
    max_slippage_pct: number;
  }) => void;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({
  onSaveStrategy,
}) => {
  const [usdcTarget, setUsdcTarget] = useState(40);
  const [wethTarget, setWethTarget] = useState(35);
  const [aeroTarget, setAeroTarget] = useState(15);
  const [virtualTarget, setVirtualTarget] = useState(10);
  const [slippage, setSlippage] = useState(0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStrategy({
      user_name: "Hackathon Judge",
      risk_tolerance: "moderate",
      target_allocation: {
        USDC: usdcTarget,
        WETH: wethTarget,
        AERO: aeroTarget,
        VIRTUAL: virtualTarget,
      },
      max_slippage_pct: slippage,
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        background: "#ffffff",
      }}
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
        <Sliders style={{ color: "#000000" }} size={24} /> Configure Target
        Strategy & Risk Rules
      </h3>
      <p
        style={{
          fontSize: "0.875rem",
          color: "#444444",
          marginBottom: "24px",
          fontWeight: 600,
        }}
      >
        Saving writes directly to Sibyl Memory WARM tier under unique constraint
        `(tenant_id, 'user_strategy', 'default_profile')`.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#000000",
                marginBottom: "6px",
                fontWeight: 900,
              }}
            >
              USDC Target Allocation (%)
            </label>
            <input
              type="number"
              value={usdcTarget}
              onChange={(e) => setUsdcTarget(Number(e.target.value))}
              style={{
                width: "100%",
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "10px",
                borderRadius: "6px",
                color: "#000000",
                fontWeight: 800,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#000000",
                marginBottom: "6px",
                fontWeight: 900,
              }}
            >
              WETH Target Allocation (%)
            </label>
            <input
              type="number"
              value={wethTarget}
              onChange={(e) => setWethTarget(Number(e.target.value))}
              style={{
                width: "100%",
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "10px",
                borderRadius: "6px",
                color: "#000000",
                fontWeight: 800,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#000000",
                marginBottom: "6px",
                fontWeight: 900,
              }}
            >
              AERO Target Allocation (%)
            </label>
            <input
              type="number"
              value={aeroTarget}
              onChange={(e) => setAeroTarget(Number(e.target.value))}
              style={{
                width: "100%",
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "10px",
                borderRadius: "6px",
                color: "#000000",
                fontWeight: 800,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                color: "#000000",
                marginBottom: "6px",
                fontWeight: 900,
              }}
            >
              VIRTUAL Target Allocation (%)
            </label>
            <input
              type="number"
              value={virtualTarget}
              onChange={(e) => setVirtualTarget(Number(e.target.value))}
              style={{
                width: "100%",
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "10px",
                borderRadius: "6px",
                color: "#000000",
                fontWeight: 800,
              }}
            />
          </div>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.85rem",
              color: "#000000",
              marginBottom: "6px",
              fontWeight: 900,
            }}
          >
            Max Slippage Tolerance (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            style={{
              width: "100%",
              background: "#ffffff",
              border: "2px solid #000000",
              padding: "10px",
              borderRadius: "6px",
              color: "#000000",
              fontWeight: 800,
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            background: "#000000",
            color: "#ffffff",
            border: "2px solid #000000",
            padding: "12px 24px",
            borderRadius: "6px",
            fontWeight: 900,
            fontSize: "0.95rem",
            cursor: "pointer",
            marginTop: "12px",
            boxShadow: "3px 3px 0px #555555",
          }}
        >
          Save Strategy to Sibyl Memory
        </button>
      </form>
    </div>
  );
};
