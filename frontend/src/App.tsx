import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import type {
  StatusData,
  MemoryDump,
  RebalanceResult,
  SearchResultItem,
} from "./types";
import {
  fetchStatus,
  fetchMemory,
  runRebalance,
  toggleLoadBearing,
  triggerColdStart,
  searchMemory,
  updateStrategy,
  triggerX402Payment,
} from "./api/client";

import { Header } from "./components/Header";
import { NotificationBanner } from "./components/NotificationBanner";
import { ControlBar } from "./components/ControlBar";
import { NavigationTabs, type TabType } from "./components/NavigationTabs";
import { PortfolioPanel } from "./components/PortfolioPanel";
import { CognitiveTerminal } from "./components/CognitiveTerminal";
import { MemoryInspector } from "./components/MemoryInspector";
import { StrategyForm } from "./components/StrategyForm";
import { VirtualsACPPanel } from "./components/VirtualsACPPanel";
import { DocsPanel } from "./components/DocsPanel";

export default function App() {
  const { address } = useAccount();
  const [status, setStatus] = useState<StatusData | null>(null);
  const [memoryDump, setMemoryDump] = useState<MemoryDump | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceResult, setRebalanceResult] =
    useState<RebalanceResult | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [notice, setNotice] = useState<string | null>(null);

  const refreshAllData = async () => {
    try {
      const [dataStatus, dataMem] = await Promise.all([
        fetchStatus(),
        fetchMemory(),
      ]);
      setStatus(dataStatus);
      setMemoryDump(dataMem);
    } catch (err) {
      console.error("API Sync Error:", err);
    }
  };

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunRebalance = async (payload?: {
    user_wallet?: string;
    real_tx_hash?: string;
    chain_id?: number;
  }) => {
    setIsRebalancing(true);
    setRebalanceResult(null);
    try {
      const data = await runRebalance(payload);
      setRebalanceResult(data);
      setNotice(data.gate_status);
      refreshAllData();
    } catch (err) {
      console.error(err);
      setRebalanceResult({
        success: false,
        gate_status: "Network Error",
        error: "Network error connecting to gEEpEE backend server.",
      });
    } finally {
      setIsRebalancing(false);
    }
  };

  const handleRequireConnect = () => {
    setNotice(
      "🔒 Please connect your wallet using the 'Connect Wallet' button in the top right to execute live Base transactions!",
    );
  };

  const handleToggleMemory = async (enabled: boolean) => {
    try {
      const data = await toggleLoadBearing(enabled);
      setNotice(data.message);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleColdStart = async () => {
    try {
      const data = await triggerColdStart();
      setNotice(data.message);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchMemory(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveStrategy = async (payload: {
    user_name: string;
    risk_tolerance: string;
    target_allocation: Record<string, number>;
    max_slippage_pct: number;
  }) => {
    try {
      const data = await updateStrategy({
        ...payload,
        user_wallet: address,
      });
      setNotice(data.message);
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerX402 = async (payload?: {
    user_wallet?: string;
    real_tx_hash?: string;
    chain_id?: number;
  }) => {
    try {
      const data = await triggerX402Payment(payload);
      const txNotice = data.explorer_url
        ? ` | View on Basescan: ${data.explorer_url}`
        : "";
      setNotice(
        `x402 Payment Verified: ${data.x402_payment_header}${txNotice}`,
      );
      refreshAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const memoryEnabled = status?.memory_stats?.load_bearing_enabled ?? true;

  return (
    <div className="app-container">
      {/* HEADER */}
      <Header status={status} memoryEnabled={memoryEnabled} />

      {/* NOTIFICATION BANNER */}
      <NotificationBanner notice={notice} onClose={() => setNotice(null)} />

      {/* ACTION & GATE TEST CONTROL BAR */}
      <ControlBar
        isRebalancing={isRebalancing}
        memoryEnabled={memoryEnabled}
        onRunRebalance={handleRunRebalance}
        onColdStart={handleColdStart}
        onTriggerX402={handleTriggerX402}
        onToggleMemory={handleToggleMemory}
        onRequireConnect={handleRequireConnect}
      />

      {/* NAVIGATION TABS */}
      <NavigationTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* MAIN CONTENT AREA WITH RESPONSIVE GRID */}
      <main>
        {activeTab === "overview" && (
          <div className="responsive-grid">
            <PortfolioPanel status={status} />
            <CognitiveTerminal
              rebalanceResult={rebalanceResult}
              isRebalancing={isRebalancing}
            />
          </div>
        )}

        {activeTab === "memory" && (
          <MemoryInspector
            status={status}
            memoryDump={memoryDump}
            searchQuery={searchQuery}
            searchResults={searchResults}
            isSearching={isSearching}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />
        )}

        {activeTab === "strategy" && (
          <StrategyForm status={status} onSaveStrategy={handleSaveStrategy} />
        )}

        {activeTab === "acp" && <VirtualsACPPanel status={status} />}

        {activeTab === "docs" && <DocsPanel status={status} />}
      </main>
    </div>
  );
}
