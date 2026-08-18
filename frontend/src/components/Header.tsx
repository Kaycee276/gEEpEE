import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { StatusData } from '../types';

interface HeaderProps {
  status: StatusData | null;
  memoryEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({ memoryEnabled }) => {
  return (
    <header className="neo-card" style={{ padding: '14px 20px', background: 'var(--neo-yellow)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* BRAND LOGO & TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src="/logo.png"
            alt="gEEpEE Monogram Logo"
            style={{
              width: '46px',
              height: '46px',
              border: '3px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              objectFit: 'contain',
              background: 'transparent'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 className="neo-title" style={{ fontSize: '1.8rem', color: '#000000', margin: 0, lineHeight: 1 }}>gEEpEE</h1>
              <span className="badge badge-virtuals" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                Sibyl Agent
              </span>
            </div>
            <p style={{ color: '#000000', fontSize: '0.85rem', marginTop: '2px', fontWeight: 700 }}>
              Autonomous Memory-Driven Onchain Vault Agent on Base
            </p>
          </div>
        </div>

        {/* MINIMIZED WEB3 & SYSTEM STATUS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className={`badge ${memoryEnabled ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
            {memoryEnabled ? 'Sibyl Memory Active' : 'Memory Offline'}
          </span>

          {/* COMPACT RAINBOWKIT CONNECT WALLET BUTTON */}
          <ConnectButton
            accountStatus="avatar"
            chainStatus="icon"
            showBalance={false}
          />
        </div>

      </div>
    </header>
  );
};
