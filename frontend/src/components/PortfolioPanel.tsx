import React from 'react';
import { useAccount, useChainId } from 'wagmi';
import type { StatusData } from '../types';

interface PortfolioPanelProps {
  status: StatusData | null;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({ status }) => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const activeWalletAddress = isConnected && address ? address : status?.wallet_info?.wallet_address;
  const activeChainLabel = isConnected
    ? `RainbowKit (Chain ID ${chainId})`
    : (status?.wallet_info?.chain || 'Base Network');

  return (
    <div className="neo-card" style={{ padding: '16px', background: '#ffffff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <h3 className="neo-title" style={{ fontSize: '1.1rem', color: '#000000', margin: 0 }}>
          Base Network Vault Portfolio
        </h3>
        <span className="badge badge-base">{activeChainLabel}</span>
      </div>

      <div style={{ marginBottom: '16px', background: isConnected ? 'var(--neo-green-light)' : 'var(--neo-cyan-light)', padding: '10px 12px', border: '2px solid #000000', boxShadow: '2px 2px 0px #000000' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 900 }}>
            {isConnected ? 'Connected Wallet' : 'Vault Wallet Address'}
          </p>
          {isConnected && <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Live Web3</span>}
        </div>
        <p className="font-mono" style={{ fontSize: '0.82rem', color: '#000000', marginTop: '4px', fontWeight: 900, wordBreak: 'break-all' }}>
          {activeWalletAddress}
        </p>
      </div>

      {/* TOKEN BALANCES */}
      <h4 style={{ fontSize: '0.88rem', fontWeight: 900, color: '#000000', marginBottom: '10px', textTransform: 'uppercase' }}>
        Onchain Balances & Target Allocation
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Object.entries(status?.wallet_info?.balances || {}).map(([token, amount]) => {
          const price = status?.token_prices?.[token] || 1;
          const valueUsd = amount * price;
          return (
            <div key={token} style={{ background: '#ffffff', padding: '10px 14px', border: '2px solid #000000', boxShadow: '3px 3px 0px #000000' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="neo-title" style={{ color: '#000000', fontSize: '1rem' }}>{token}</span>
                <span className="font-mono" style={{ color: '#000000', fontWeight: 900, fontSize: '0.85rem' }}>
                  {amount.toFixed(4)} {token} (${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD)
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#333333', fontWeight: 700 }}>
                Market Price: ${price.toFixed(2)} USD
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
