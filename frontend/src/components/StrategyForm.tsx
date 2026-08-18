import React, { useState, useEffect } from 'react';
import type { StatusData } from '../types';

interface StrategyFormProps {
  status: StatusData | null;
  onSaveStrategy: (payload: {
    user_name: string;
    risk_tolerance: string;
    target_allocation: Record<string, number>;
    max_slippage_pct: number;
  }) => Promise<void> | void;
}

export const StrategyForm: React.FC<StrategyFormProps> = ({ status, onSaveStrategy }) => {
  const [userName, setUserName] = useState('Hackathon Judge');
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [usdcAlloc, setUsdcAlloc] = useState(40);
  const [wethAlloc, setWethAlloc] = useState(30);
  const [aeroAlloc, setAeroAlloc] = useState(20);
  const [virtualAlloc, setVirtualAlloc] = useState(10);
  const [maxSlippage, setMaxSlippage] = useState(0.5);

  const [isSaving, setIsSaving] = useState(false);

  // Sync form state with strategy loaded from Sibyl Memory (SQLite / status)
  useEffect(() => {
    if (status?.recalled_strategy) {
      const raw = status.recalled_strategy;
      const strat = raw.body ? (typeof raw.body === 'string' ? JSON.parse(raw.body) : raw.body) : raw;

      if (strat?.user_name) setUserName(strat.user_name);
      if (strat?.risk_tolerance) setRiskTolerance(strat.risk_tolerance);
      if (typeof strat?.max_slippage_pct === 'number') setMaxSlippage(strat.max_slippage_pct);

      if (strat?.target_allocation) {
        const alloc = strat.target_allocation;
        if (typeof alloc.USDC === 'number') setUsdcAlloc(alloc.USDC);
        if (typeof alloc.WETH === 'number') setWethAlloc(alloc.WETH);
        if (typeof alloc.AERO === 'number') setAeroAlloc(alloc.AERO);
        if (typeof alloc.VIRTUAL === 'number') setVirtualAlloc(alloc.VIRTUAL);
      }
    }
  }, [JSON.stringify(status?.recalled_strategy)]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveStrategy({
        user_name: userName,
        risk_tolerance: riskTolerance,
        target_allocation: {
          USDC: usdcAlloc,
          WETH: wethAlloc,
          AERO: aeroAlloc,
          VIRTUAL: virtualAlloc,
        },
        max_slippage_pct: maxSlippage,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="neo-card" style={{ padding: '20px', background: '#ffffff' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 className="neo-title" style={{ fontSize: '1.2rem', color: '#000000', margin: 0 }}>
          Vault Strategy & WARM Entity Configurator (Drizzle ORM + Turso Cloud Sync)
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#333333', marginTop: '2px', fontWeight: 700 }}>
          Data: User risk tolerance, token target allocation %, max slippage limits saved into Sibyl Memory WARM tier with UNIQUE constraints.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Profile Name
            </label>
            <input
              type="text"
              className="neo-input"
              style={{ width: '100%' }}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Risk Profile
            </label>
            <select
              className="neo-input"
              style={{ width: '100%' }}
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive (DeFi Degen)</option>
            </select>
          </div>
        </div>

        <div style={{ background: 'var(--neo-yellow-light)', border: '2px solid #000000', padding: '12px' }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>
            Target Portfolio Allocation (%)
          </h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>USDC: {usdcAlloc}%</label>
              <input type="range" min="0" max="100" value={usdcAlloc} onChange={(e) => setUsdcAlloc(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>WETH: {wethAlloc}%</label>
              <input type="range" min="0" max="100" value={wethAlloc} onChange={(e) => setWethAlloc(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>AERO: {aeroAlloc}%</label>
              <input type="range" min="0" max="100" value={aeroAlloc} onChange={(e) => setAeroAlloc(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 900 }}>VIRTUAL: {virtualAlloc}%</label>
              <input type="range" min="0" max="100" value={virtualAlloc} onChange={(e) => setVirtualAlloc(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Max DEX Slippage Threshold (%): {maxSlippage}%
          </label>
          <input
            type="number"
            step="0.1"
            className="neo-input"
            style={{ width: '100%' }}
            value={maxSlippage}
            onChange={(e) => setMaxSlippage(Number(e.target.value))}
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="neo-btn neo-btn-green"
          style={{
            marginTop: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            opacity: isSaving ? 0.6 : 1,
            cursor: isSaving ? 'wait' : 'pointer'
          }}
        >
          {isSaving && <span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span>}
          {isSaving ? 'Saving to Sibyl Memory (WARM Tier)...' : 'Save Strategy to Sibyl Memory (WARM Tier)'}
        </button>
      </form>
    </div>
  );
};
