import React from "react";
import { Activity, Database, Sliders, Radio } from "lucide-react";

export type TabType = "overview" | "memory" | "strategy" | "acp";

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
    },
    {
      id: "memory" as TabType,
      label: "Sibyl 5-Tier Memory Inspector",
      icon: Database,
    },
    {
      id: "strategy" as TabType,
      label: "Strategy & WARM Entities",
      icon: Sliders,
    },
    { id: "acp" as TabType, label: "Virtuals ACP Protocol", icon: Radio },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "24px",
        borderBottom: "2px solid #000000",
        paddingBottom: "10px",
        flexWrap: "wrap",
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              background: isActive ? "#000000" : "#ffffff",
              color: isActive ? "#ffffff" : "#000000",
              border: "2px solid #000000",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: 900,
              fontSize: "0.9rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: isActive
                ? "3px 3px 0px #555555"
                : "2px 2px 0px #000000",
              transition: "all 0.15s ease",
            }}
          >
            <Icon size={16} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
};
