import React from "react";
import { Activity, Database, Sliders, Radio, FileText } from "lucide-react";

export type TabType = "overview" | "memory" | "strategy" | "acp" | "docs";

interface NavigationTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: "overview" as TabType,
      label: "Portfolio & Base Engine",
      icon: Activity,
      bg: "var(--neo-cyan)",
    },
    {
      id: "memory" as TabType,
      label: "Sibyl 5-Tier Memory Inspector",
      icon: Database,
      bg: "var(--neo-yellow)",
    },
    {
      id: "strategy" as TabType,
      label: "Strategy & WARM Entities",
      icon: Sliders,
      bg: "var(--neo-green)",
    },
    {
      id: "acp" as TabType,
      label: "Virtuals ACP Protocol",
      icon: Radio,
      bg: "var(--neo-purple)",
    },
    {
      id: "docs" as TabType,
      label: "System Stats & Ref Docs",
      icon: FileText,
      bg: "var(--neo-yellow-light)",
    },
  ];

  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              background: isActive ? tab.bg : "#ffffff",
              color: "#000000",
              border: "3px solid #000000",
              padding: "12px 20px",
              fontWeight: 900,
              fontSize: "0.92rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: isActive
                ? "5px 5px 0px #000000"
                : "3px 3px 0px #000000",
              transform: isActive ? "translate(-2px, -2px)" : "none",
              transition: "all 0.1s ease",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <Icon size={18} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
};
