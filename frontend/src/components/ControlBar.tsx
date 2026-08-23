import React, { useState } from "react";
import { useAccount, useSendTransaction, useChainId } from "wagmi";
import { parseEther } from "viem";

interface ControlBarProps {
  isRebalancing: boolean;
  memoryEnabled: boolean;
  onRunRebalance: (payload?: {
    user_wallet?: string;
    real_tx_hash?: string;
    chain_id?: number;
  }) => Promise<void> | void;
  onColdStart: () => Promise<void> | void;
  onTriggerX402: (payload?: {
    user_wallet?: string;
    real_tx_hash?: string;
  }) => Promise<void> | void;
  onToggleMemory: (enabled: boolean) => Promise<void> | void;
  onRequireConnect: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRebalancing,
  memoryEnabled,
  onRunRebalance,
  onColdStart,
  onTriggerX402,
  onToggleMemory,
  onRequireConnect,
}) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendTransactionAsync } = useSendTransaction();

  const [isSigningRebalance, setIsSigningRebalance] = useState(false);
  const [isSigningX402, setIsSigningX402] = useState(false);
  const [isColdStarting, setIsColdStarting] = useState(false);
  const [isTogglingMemory, setIsTogglingMemory] = useState(false);

  const isActionLocked = !isConnected || !memoryEnabled;
  const isRebalanceBusy = isRebalancing || isSigningRebalance;

  const handleRebalanceClick = async () => {
    if (!isConnected) {
      onRequireConnect();
      return;
    }
    if (!memoryEnabled) {
      return;
    }

    setIsSigningRebalance(true);
    try {
      let realTxHash: string | undefined = undefined;
      if (sendTransactionAsync && address) {
        try {
          const tx = await sendTransactionAsync({
            to: address,
            value: parseEther("0.000001"),
          });
          realTxHash = tx;
        } catch (err) {
          console.warn(
            "Onchain wallet signature user cancelled or rejected:",
            err,
          );
          return; // Strictly abort if user cancelled in wallet
        }
      }

      await onRunRebalance({
        user_wallet: address,
        real_tx_hash: realTxHash,
        chain_id: chainId,
      });
    } catch (err) {
      console.error("Rebalance execution error:", err);
    } finally {
      setIsSigningRebalance(false);
    }
  };

  const handleX402Click = async () => {
    if (!isConnected) {
      onRequireConnect();
      return;
    }
    if (!memoryEnabled) {
      return;
    }

    setIsSigningX402(true);
    try {
      let realTxHash: string | undefined = undefined;
      if (sendTransactionAsync && address) {
        try {
          const tx = await sendTransactionAsync({
            to: address,
            value: parseEther("0.000001"),
          });
          realTxHash = tx;
        } catch (err) {
          console.warn("x402 signature user cancelled or rejected:", err);
          return; // Strictly abort if user cancelled in wallet
        }
      }

      await onTriggerX402({
        user_wallet: address,
        real_tx_hash: realTxHash,
      });
    } catch (err) {
      console.error("x402 test execution error:", err);
    } finally {
      setIsSigningX402(false);
    }
  };

  const handleColdStartClick = async () => {
    setIsColdStarting(true);
    try {
      await onColdStart();
    } finally {
      setIsColdStarting(false);
    }
  };

  const handleToggleMemoryClick = async () => {
    setIsTogglingMemory(true);
    try {
      await onToggleMemory(!memoryEnabled);
    } finally {
      setIsTogglingMemory(false);
    }
  };

  return (
    <section
      className="neo-card"
      style={{
        padding: "10px 14px",
        background: "#ffffff",
        position: "relative",
      }}
    >
      {/* WARNING BANNERS FOR DISCONNECTED WALLET OR REMOVED MEMORY */}
      {!isConnected ? (
        <div
          style={{
            background: "var(--neo-yellow-light)",
            border: "2px solid #000000",
            boxShadow: "2px 2px 0px #000000",
            padding: "6px 12px",
            marginBottom: "10px",
            fontSize: "0.78rem",
            fontWeight: 900,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Wallet Not Connected.</span>
        </div>
      ) : !memoryEnabled ? (
        <div
          style={{
            background: "var(--neo-red-light)",
            border: "2px solid #000000",
            boxShadow: "2px 2px 0px #000000",
            padding: "6px 12px",
            marginBottom: "10px",
            fontSize: "0.78rem",
            fontWeight: 900,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Memory Removed (Litmus Gate Active).</span>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* PRIMARY ONCHAIN ACTIONS (BLURRED & LOCKED WHEN DISCONNECTED OR MEMORY REMOVED) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleRebalanceClick}
            disabled={isActionLocked || isRebalanceBusy}
            className="neo-btn neo-btn-yellow"
            style={{
              filter: isActionLocked ? "blur(1.5px)" : "none",
              opacity: isActionLocked || isRebalanceBusy ? 0.45 : 1,
              cursor:
                isActionLocked || isRebalanceBusy ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isRebalanceBusy && (
              <span
                className="animate-spin"
                style={{ display: "inline-block" }}
              >
                ⏳
              </span>
            )}
            {isRebalanceBusy
              ? "Prompting Wallet & Rebalancing..."
              : "Run Rebalance"}
          </button>

          <button
            onClick={handleX402Click}
            disabled={isActionLocked || isSigningX402}
            className="neo-btn neo-btn-cyan"
            style={{
              filter: isActionLocked ? "blur(1.5px)" : "none",
              opacity: isActionLocked || isSigningX402 ? 0.45 : 1,
              cursor:
                isActionLocked || isSigningX402 ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isSigningX402 && (
              <span
                className="animate-spin"
                style={{ display: "inline-block" }}
              ></span>
            )}
            {isSigningX402
              ? "Prompting Wallet & Verifying..."
              : "Test x402 Header"}
          </button>

          <button
            onClick={handleColdStartClick}
            disabled={isColdStarting}
            className="neo-btn neo-btn-white"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              opacity: isColdStarting ? 0.6 : 1,
              cursor: isColdStarting ? "wait" : "pointer",
            }}
          >
            {isColdStarting && (
              <span
                className="animate-spin"
                style={{ display: "inline-block" }}
              ></span>
            )}
            {isColdStarting ? "Recalling Disk State..." : "Cold-Start Recall"}
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
                letterSpacing: "0.04em",
              }}
            >
              Litmus Gate Test
            </span>
            <span
              style={{ fontSize: "0.78rem", color: "#000000", fontWeight: 900 }}
            >
              {memoryEnabled ? "Memory: ACTIVE" : "Memory: REMOVED"}
            </span>
          </div>

          <button
            onClick={handleToggleMemoryClick}
            disabled={isTogglingMemory}
            className={`neo-btn ${memoryEnabled ? "neo-btn-red" : "neo-btn-green"}`}
            style={{
              padding: "4px 8px",
              fontSize: "0.72rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isTogglingMemory && (
              <span className="animate-spin" style={{ fontSize: "0.65rem" }}>
                ⏳
              </span>
            )}
            {isTogglingMemory
              ? "Updating..."
              : memoryEnabled
                ? "Delete"
                : "Restore"}
          </button>
        </div>
      </div>
    </section>
  );
};
