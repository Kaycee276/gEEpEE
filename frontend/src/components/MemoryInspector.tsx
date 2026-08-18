import React, { useState } from "react";
import type { StatusData, MemoryDump, SearchResultItem } from "../types";
import { SkeletonLoader } from "./SkeletonLoader";

interface MemoryInspectorProps {
  status: StatusData | null;
  memoryDump: MemoryDump | null;
  searchQuery: string;
  searchResults: SearchResultItem[];
  isSearching: boolean;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  status,
  memoryDump,
  searchQuery,
  searchResults,
  isSearching,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [memoryTierTab, setMemoryTierTab] = useState<
    "warm" | "cold" | "hot" | "reference"
  >("warm");

  if (!memoryDump) {
    return (
      <div
        className="neo-card"
        style={{ padding: "20px", background: "#ffffff" }}
      >
        <h3
          className="neo-title"
          style={{ fontSize: "1.2rem", color: "#000000", marginBottom: "14px" }}
        >
          Sibyl 5-Tier Memory Architecture Inspector
        </h3>
        <SkeletonLoader count={5} height="70px" />
      </div>
    );
  }

  return (
    <div
      className="neo-card"
      style={{ padding: "16px", background: "#ffffff", overflow: "hidden" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h3
            className="neo-title"
            style={{ fontSize: "1.2rem", color: "#000000", margin: 0 }}
          >
            Sibyl 5-Tier Memory Architecture Inspector
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#333333",
              marginTop: "2px",
              fontWeight: 700,
            }}
          >
            Data: Local SQLite Database (`{status?.memory_stats?.db_path}`).
            Zero Embeddings · FTS5 Powered.
          </p>
        </div>

        {/* FTS5 SEARCH FORM */}
        <form
          onSubmit={onSearchSubmit}
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          <input
            type="text"
            placeholder="FTS5 Search Memory..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="neo-input"
            style={{ flex: 1, minWidth: "160px" }}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="neo-btn neo-btn-yellow"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* SEARCH RESULTS DISPLAY */}
      {searchResults.length > 0 && (
        <div
          style={{
            background: "var(--neo-yellow-light)",
            padding: "12px",
            marginBottom: "16px",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
          }}
        >
          <h4
            style={{
              fontSize: "0.88rem",
              color: "#000000",
              marginBottom: "6px",
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            FTS5 Search Results for "{searchQuery}":
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "0.8rem",
                  color: "#000000",
                  fontWeight: 700,
                  background: "#ffffff",
                  padding: "6px 10px",
                  border: "2px solid #000000",
                  wordBreak: "break-all",
                }}
              >
                <span className="badge badge-sibyl">{item.category}</span>{" "}
                <strong>{item.name}</strong>: {item.snippet}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MEMORY TIER SELECTOR */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            id: "warm",
            label: `WARM (${memoryDump?.warm_entities?.length || 0})`,
            bg: "var(--neo-yellow)",
          },
          {
            id: "cold",
            label: `COLD Journal (${memoryDump?.cold_journal?.length || 0})`,
            bg: "var(--neo-cyan)",
          },
          { id: "hot", label: "HOT State", bg: "var(--neo-green)" },
          {
            id: "reference",
            label: "REFERENCE Specs",
            bg: "var(--neo-purple)",
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMemoryTierTab(t.id as any)}
            style={{
              background: memoryTierTab === t.id ? t.bg : "#ffffff",
              color: "#000000",
              border: "2px solid #000000",
              padding: "6px 12px",
              fontWeight: 900,
              fontSize: "0.78rem",
              cursor: "pointer",
              boxShadow:
                memoryTierTab === t.id
                  ? "3px 3px 0px #000000"
                  : "1px 1px 0px #000000",
              textTransform: "uppercase",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TIER CONTENTS */}
      {memoryTierTab === "warm" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {memoryDump?.warm_entities?.map((ent, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: "12px",
                border: "2px solid #000000",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                <span className="badge badge-sibyl">{ent.category}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#000000",
                    fontWeight: 700,
                  }}
                >
                  Updated: {ent.updated_at}
                </span>
              </div>
              <h4
                className="neo-title"
                style={{
                  fontSize: "0.95rem",
                  color: "#000000",
                  marginBottom: "6px",
                }}
              >
                {ent.name}
              </h4>
              <pre
                className="font-mono"
                style={{
                  fontSize: "0.78rem",
                  color: "#000000",
                  background: "var(--neo-bg)",
                  padding: "10px",
                  border: "2px solid #000000",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  fontWeight: 700,
                }}
              >
                {JSON.stringify(ent.body, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}

      {memoryTierTab === "cold" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {memoryDump?.cold_journal?.map((j, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                padding: "12px",
                border: "2px solid #000000",
                boxShadow: "2px 2px 0px #000000",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    color: "#000000",
                    fontSize: "0.88rem",
                    textTransform: "uppercase",
                  }}
                >
                  {j.action}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#000000",
                    fontWeight: 700,
                  }}
                >
                  {j.timestamp}
                </span>
              </div>
              {j.tx_hash && (
                <div
                  className="font-mono"
                  style={{
                    fontSize: "0.78rem",
                    color: "#000000",
                    marginTop: "4px",
                    fontWeight: 900,
                    wordBreak: "break-all",
                  }}
                >
                  Tx Hash: {j.tx_hash}
                </div>
              )}
              {j.details && (
                <pre
                  className="font-mono"
                  style={{
                    fontSize: "0.75rem",
                    color: "#000000",
                    marginTop: "6px",
                    background: "var(--neo-cyan-light)",
                    padding: "8px",
                    border: "2px solid #000000",
                    fontWeight: 700,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {JSON.stringify(j.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {memoryTierTab === "hot" && (
        <div
          style={{
            background: "#ffffff",
            padding: "12px",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
          }}
        >
          <h4
            className="neo-title"
            style={{
              fontSize: "0.95rem",
              color: "#000000",
              marginBottom: "8px",
            }}
          >
            HOT Working State
          </h4>
          <pre
            className="font-mono"
            style={{
              fontSize: "0.78rem",
              color: "#000000",
              background: "var(--neo-green-light)",
              padding: "10px",
              border: "2px solid #000000",
              fontWeight: 700,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {JSON.stringify(memoryDump?.hot_state, null, 2)}
          </pre>
        </div>
      )}

      {memoryTierTab === "reference" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {memoryDump?.reference_docs?.map(
            (doc, idx) =>
              doc && (
                <div
                  key={idx}
                  style={{
                    background: "#ffffff",
                    padding: "12px",
                    border: "2px solid #000000",
                    boxShadow: "3px 3px 0px #000000",
                  }}
                >
                  <h4
                    className="neo-title"
                    style={{
                      fontSize: "0.95rem",
                      color: "#000000",
                      marginBottom: "4px",
                    }}
                  >
                    {doc.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "#222222",
                      marginTop: "4px",
                      fontWeight: 700,
                      wordBreak: "break-word",
                    }}
                  >
                    {doc.content}
                  </p>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
};
