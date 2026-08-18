import React from 'react';
import { Zap, RefreshCw, DollarSign } from 'lucide-react';

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
  onToggleMemory
}) => {
  return (
    <section className="neo-card" style={{ padding: '10px 14px', background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* PRIMARY ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={onRunRebalance}
            disabled={isRebalancing}
            className="neo-btn neo-btn-yellow"
          >
            {isRebalancing ? <RefreshCw className="animate-spin" size={15} /> : <Zap size={15} />}
            {isRebalancing ? 'Rebalancing...' : 'Run Rebalance'}
          </button>

          <button
            onClick={onColdStart}
            className="neo-btn neo-btn-white"
          >
            <RefreshCw size={14} /> Cold-Start Recall
          </button>

          <button
            onClick={onTriggerX402}
            className="neo-btn neo-btn-cyan"
          >
            <DollarSign size={14} /> Test x402 Header
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
