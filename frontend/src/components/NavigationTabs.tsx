import React from 'react';
import { Activity, Database, Sliders, Radio, FileText } from 'lucide-react';

export type TabType = 'overview' | 'memory' | 'strategy' | 'acp' | 'docs';

interface NavigationTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'overview' as TabType, label: 'Portfolio & Engine', icon: Activity, bg: 'var(--neo-cyan)' },
    { id: 'memory' as TabType, label: 'Sibyl 5-Tier Memory', icon: Database, bg: 'var(--neo-yellow)' },
    { id: 'strategy' as TabType, label: 'Strategy & WARM', icon: Sliders, bg: 'var(--neo-green)' },
    { id: 'acp' as TabType, label: 'Virtuals ACP', icon: Radio, bg: 'var(--neo-purple)' },
    { id: 'docs' as TabType, label: 'System Specs', icon: FileText, bg: 'var(--neo-yellow-light)' }
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              background: isActive ? tab.bg : '#ffffff',
              color: '#000000',
              border: '2.5px solid #000000',
              padding: '8px 14px',
              fontWeight: 900,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isActive ? '3px 3px 0px #000000' : '2px 2px 0px #000000',
              transform: isActive ? 'translate(-1px, -1px)' : 'none',
              transition: 'all 0.1s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.03em'
            }}
          >
            <Icon size={15} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
};
