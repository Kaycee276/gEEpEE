import React from 'react';
import type { StatusData } from '../types';
import { SkeletonLoader } from './SkeletonLoader';

interface VirtualsACPPanelProps {
  status: StatusData | null;
}

export const VirtualsACPPanel: React.FC<VirtualsACPPanelProps> = ({ status }) => {
  if (!status) {
    return (
      <div className="neo-card" style={{ padding: '20px', background: '#ffffff' }}>
        <h3 className="neo-title" style={{ fontSize: '1.2rem', color: '#000000', marginBottom: '14px' }}>
          Virtuals Protocol ACP Architecture
        </h3>
        <SkeletonLoader count={4} height="60px" />
      </div>
    );
  }

  const registry = status?.virtuals_registry;

  return (
    <div className="neo-card" style={{ padding: '20px', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 className="neo-title" style={{ fontSize: '1.2rem', color: '#000000', margin: 0 }}>
          Virtuals Protocol ACP Architecture
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#333333', marginTop: '2px', fontWeight: 700 }}>
          Data: Inter-agent signal registration, reputation score, job protocol broadcasting, and peer communication logs.
        </p>
      </div>

      <div style={{ background: 'var(--neo-purple-light)', border: '2.5px solid #000000', boxShadow: '3px 3px 0px #000000', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h4 className="neo-title" style={{ fontSize: '1.05rem', color: '#000000', margin: 0 }}>
              Agent ACP Identity
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#000000', fontWeight: 700, marginTop: '2px' }}>
              Agent ID: <code>{registry?.agent_id}</code>
            </p>
          </div>
          <span className="badge badge-virtuals">
            Reputation: {registry?.reputation_score} / 100
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '12px' }}>
          <div style={{ background: '#ffffff', border: '2px solid #000000', padding: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>Protocol Standard</span>
            <p style={{ fontSize: '0.85rem', fontWeight: 900, marginTop: '2px' }}>{registry?.protocol}</p>
          </div>
          <div style={{ background: '#ffffff', border: '2px solid #000000', padding: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>Active Pair Pool</span>
            <p style={{ fontSize: '0.85rem', fontWeight: 900, marginTop: '2px' }}>USDC / WETH / AERO</p>
          </div>
          <div style={{ background: '#ffffff', border: '2px solid #000000', padding: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, textTransform: 'uppercase' }}>Capabilities</span>
            <p style={{ fontSize: '0.85rem', fontWeight: 900, marginTop: '2px' }}>Signal Broadcaster & Vault Exec</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', border: '2px solid #000000', boxShadow: '3px 3px 0px #000000', padding: '16px' }}>
        <h4 className="neo-title" style={{ fontSize: '0.95rem', color: '#000000', marginBottom: '8px' }}>
          Recent Inter-Agent Job Signals
        </h4>
        <pre className="font-mono" style={{ fontSize: '0.78rem', color: '#000000', background: 'var(--neo-bg)', padding: '12px', border: '2px solid #000000', fontWeight: 700 }}>
          {JSON.stringify({
            recent_jobs: [
              {
                job_id: "acp_job_8453_001",
                job_type: "ACP_SIGNAL_REBALANCE",
                payload: { agent: "gEEpEE", rebalanced_pair: "USDC/WETH" },
                status: "BROADCAST_VERIFIED"
              }
            ]
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
};
