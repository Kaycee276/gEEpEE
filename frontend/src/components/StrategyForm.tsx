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
      className="neo-card"
      style={{
        padding: "28px",
        maxWidth: "800px",
        margin: "0 auto",
        background: "#ffffff",
      }}
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
        <Sliders style={{ color: "#000000" }} size={26} /> Configure Target
        Strategy & Risk Rules
      </h3>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#333333",
          marginBottom: "24px",
          fontWeight: 700,
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
            gap: "18px",
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
                textTransform: "uppercase",
              }}
            >
              USDC Target Allocation (%)
            </label>
            <input
              type="number"
              value={usdcTarget}
              onChange={(e) => setUsdcTarget(Number(e.target.value))}
              className="neo-input"
              style={{ width: "100%" }}
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
                textTransform: "uppercase",
              }}
            >
              WETH Target Allocation (%)
            </label>
            <input
              type="number"
              value={wethTarget}
              onChange={(e) => setWethTarget(Number(e.target.value))}
              className="neo-input"
              style={{ width: "100%" }}
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
                textTransform: "uppercase",
              }}
            >
              AERO Target Allocation (%)
            </label>
            <input
              type="number"
              value={aeroTarget}
              onChange={(e) => setAeroTarget(Number(e.target.value))}
              className="neo-input"
              style={{ width: "100%" }}
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
                textTransform: "uppercase",
              }}
            >
              VIRTUAL Target Allocation (%)
            </label>
            <input
              type="number"
              value={virtualTarget}
              onChange={(e) => setVirtualTarget(Number(e.target.value))}
              className="neo-input"
              style={{ width: "100%" }}
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
              textTransform: "uppercase",
            }}
          >
            Max Slippage Tolerance (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            className="neo-input"
            style={{ width: "100%" }}
          />
        </div>

        <button
          type="submit"
          className="neo-btn neo-btn-green"
          style={{
            marginTop: "12px",
            padding: "14px",
            width: "100%",
            justifyContent: "center",
          }}
        >
          Save Strategy to Sibyl Memory
        </button>
      </form>
    </div>
  );
};
