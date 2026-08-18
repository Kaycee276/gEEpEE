import React from 'react';
import { useAccount, useSendTransaction, useChainId } from 'wagmi';
import { parseEther } from 'viem';

interface ControlBarProps {
  isRebalancing: boolean;
  memoryEnabled: boolean;
  onRunRebalance: (payload?: { user_wallet?: string; real_tx_hash?: string; chain_id?: number }) => void;
  onColdStart: () => void;
  onTriggerX402: (payload?: { user_wallet?: string; real_tx_hash?: string }) => void;
  onToggleMemory: (enabled: boolean) => void;
  onRequireConnect: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isRebalancing,
  memoryEnabled,
  onRunRebalance,
  onColdStart,
  onTriggerX402,
  onToggleMemory,
  onRequireConnect
}) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { sendTransactionAsync } = useSendTransaction();

  const handleRebalanceClick = async () => {
    if (!isConnected) {
      onRequireConnect();
      return;
    }

    try {
      // Execute REAL onchain transaction on Base via connected user wallet
      let realTxHash: string | undefined = undefined;
      if (sendTransactionAsync && address) {
        try {
          const tx = await sendTransactionAsync({
            to: address, // Self-transaction or vault interaction on Base
            value: parseEther('0.000001'),
          });
          realTxHash = tx;
        } catch (err) {
          console.warn('Onchain wallet signature user cancelled or failed:', err);
        }
      }

      onRunRebalance({
        user_wallet: address,
        real_tx_hash: realTxHash,
        chain_id: chainId
      });
    } catch (err) {
      console.error('Rebalance execution error:', err);
    }
  };

  const handleX402Click = async () => {
    if (!isConnected) {
      onRequireConnect();
      return;
    }

    try {
      let realTxHash: string | undefined = undefined;
      if (sendTransactionAsync && address) {
        try {
          const tx = await sendTransactionAsync({
            to: address,
            value: parseEther('0.000001'),
          });
          realTxHash = tx;
        } catch (err) {
          console.warn('x402 signature user cancelled or failed:', err);
        }
      }

      onTriggerX402({
        user_wallet: address,
        real_tx_hash: realTxHash
      });
    } catch (err) {
      console.error('x402 test execution error:', err);
    }
  };

  return (
    <section className="neo-card" style={{ padding: '10px 14px', background: '#ffffff', position: 'relative' }}>
      
      {/* DISCONNECTED WALLET WARNING BANNER */}
      {!isConnected && (
        <div style={{
          background: 'var(--neo-yellow-light)',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          padding: '6px 12px',
          marginBottom: '10px',
          fontSize: '0.78rem',
          fontWeight: 900,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>🔒 Wallet Not Connected. Onchain buttons are locked. Connect wallet via RainbowKit above to execute real Base transactions.</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* PRIMARY ONCHAIN ACTIONS (BLURRED & LOCKED WHEN DISCONNECTED) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRebalanceClick}
            disabled={isRebalancing}
            className="neo-btn neo-btn-yellow"
            style={{
              filter: isConnected ? 'none' : 'blur(1.5px)',
              opacity: isConnected ? 1 : 0.45,
              cursor: isConnected ? 'pointer' : 'not-allowed'
            }}
          >
            {isRebalancing ? 'Rebalancing...' : 'Run Rebalance'}
          </button>

          <button
            onClick={handleX402Click}
            className="neo-btn neo-btn-cyan"
            style={{
              filter: isConnected ? 'none' : 'blur(1.5px)',
              opacity: isConnected ? 1 : 0.45,
              cursor: isConnected ? 'pointer' : 'not-allowed'
            }}
          >
            Test x402 Header
          </button>

          <button
            onClick={onColdStart}
            className="neo-btn neo-btn-white"
          >
            Cold-Start Recall
          </button>
        </div>

        {/* LITMUS GATE TEST SWITCH */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: memoryEnabled ? 'var(--neo-green-light)' : 'var(--neo-red-light)',
          padding: '6px 12px',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Litmus Gate Test
            </span>
            <span style={{ fontSize: '0.78rem', color: '#000000', fontWeight: 900 }}>
              {memoryEnabled ? 'Memory: ACTIVE' : 'Memory: REMOVED'}
            </span>
          </div>

          <button
            onClick={() => onToggleMemory(!memoryEnabled)}
            className={`neo-btn ${memoryEnabled ? 'neo-btn-red' : 'neo-btn-green'}`}
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          >
            {memoryEnabled ? 'Delete' : 'Restore'}
          </button>
        </div>

      </div>
    </section>
  );
};
