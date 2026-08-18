import React, { useState } from "react";
import { Database, Search } from "lucide-react";
import type { StatusData, MemoryDump, SearchResultItem } from "../types";

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

  return (
    <div
      className="glass-panel"
      style={{ padding: "24px", background: "#ffffff" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 900,
              color: "#000000",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Database style={{ color: "#000000" }} size={24} /> Sibyl 5-Tier
            Memory Architecture Inspector
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#444444",
              marginTop: "4px",
              fontWeight: 600,
            }}
          >
            Local SQLite Database (`{status?.memory_stats?.db_path}`). Zero
            Embeddings · FTS5 Powered.
          </p>
        </div>

        {/* FTS5 SEARCH FORM */}
        <form onSubmit={onSearchSubmit} style={{ display: "flex", gap: "8px" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="FTS5 Search Memory..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                background: "#ffffff",
                border: "2px solid #000000",
                padding: "8px 12px 8px 36px",
                borderRadius: "6px",
                color: "#000000",
                fontSize: "0.9rem",
                width: "240px",
                fontWeight: 700,
              }}
            />
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "10px",
                top: "12px",
                color: "#000000",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            style={{
              background: "#000000",
              color: "#ffffff",
              border: "2px solid #000000",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: 900,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* SEARCH RESULTS DISPLAY */}
      {searchResults.length > 0 && (
        <div
          style={{
            background: "#fef3c7",
            padding: "16px",
            borderRadius: "6px",
            marginBottom: "24px",
            border: "2px solid #000000",
          }}
        >
          <h4
            style={{
              fontSize: "0.95rem",
              color: "#000000",
              marginBottom: "10px",
              fontWeight: 900,
            }}
          >
            FTS5 Search Results for "{searchQuery}":
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "0.85rem",
                  color: "#000000",
                  fontWeight: 600,
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
          gap: "10px",
          marginBottom: "20px",
          borderBottom: "2px solid #000000",
          paddingBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            id: "warm",
            label: `WARM Entities (${memoryDump?.warm_entities?.length || 0})`,
          },
          {
            id: "cold",
            label: `COLD Journal (${memoryDump?.cold_journal?.length || 0})`,
          },
          { id: "hot", label: "HOT State" },
          { id: "reference", label: "REFERENCE Docs" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setMemoryTierTab(t.id as any)}
            style={{
              background: memoryTierTab === t.id ? "#000000" : "#ffffff",
              color: memoryTierTab === t.id ? "#ffffff" : "#000000",
              border: "2px solid #000000",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: 900,
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TIER CONTENTS */}
      {memoryTierTab === "warm" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {memoryDump?.warm_entities?.map((ent, idx) => (
            <div
              key={idx}
              style={{
                background: "#f8f9fa",
                padding: "16px",
                borderRadius: "6px",
                border: "2px solid #000000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span className="badge badge-sibyl">{ent.category}</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "#555555",
                    fontWeight: 700,
                  }}
                >
                  Updated: {ent.updated_at}
                </span>
              </div>
              <h4
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 900,
                  color: "#000000",
                  marginBottom: "8px",
                }}
              >
                {ent.name}
              </h4>
              <pre
                className="font-mono"
                style={{
                  fontSize: "0.85rem",
                  color: "#000000",
                  background: "#ffffff",
                  padding: "12px",
                  borderRadius: "4px",
                  border: "1px solid #000000",
                  overflowX: "auto",
                  fontWeight: 600,
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
                background: "#f8f9fa",
                padding: "14px",
                borderRadius: "6px",
                border: "2px solid #000000",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    color: "#000000",
                    fontSize: "0.95rem",
                  }}
                >
                  {j.action}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#555555",
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
                    fontSize: "0.85rem",
                    color: "#0284c7",
                    marginTop: "4px",
                    fontWeight: 700,
                  }}
                >
                  Tx Hash: {j.tx_hash}
                </div>
              )}
              {j.details && (
                <pre
                  className="font-mono"
                  style={{
                    fontSize: "0.8rem",
                    color: "#222222",
                    marginTop: "6px",
                    background: "#ffffff",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #000000",
                    fontWeight: 600,
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
            background: "#f8f9fa",
            padding: "16px",
            borderRadius: "6px",
            border: "2px solid #000000",
          }}
        >
          <h4
            style={{
              fontSize: "1rem",
              color: "#000000",
              marginBottom: "8px",
              fontWeight: 900,
            }}
          >
            HOT Working State (Active Locks & Working Memory)
          </h4>
          <pre
            className="font-mono"
            style={{
              fontSize: "0.85rem",
              color: "#000000",
              background: "#ffffff",
              padding: "14px",
              borderRadius: "4px",
              border: "1px solid #000000",
              fontWeight: 600,
            }}
          >
            {JSON.stringify(memoryDump?.hot_state, null, 2)}
          </pre>
        </div>
      )}

      {memoryTierTab === "reference" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {memoryDump?.reference_docs?.map(
            (doc, idx) =>
              doc && (
                <div
                  key={idx}
                  style={{
                    background: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "6px",
                    border: "2px solid #000000",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 900,
                      color: "#000000",
                      marginBottom: "4px",
                    }}
                  >
                    {doc.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#222222",
                      marginTop: "6px",
                      fontWeight: 600,
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
