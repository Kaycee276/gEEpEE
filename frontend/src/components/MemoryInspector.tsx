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
      className="neo-card"
      style={{
        padding: "18px",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          flexWrap: "nowrap",
          gap: "12px",
          flexShrink: 0,
        }}
      >
        <div>
          <h3
            className="neo-title"
            style={{
              fontSize: "1.2rem",
              color: "#000000",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              margin: 0,
            }}
          >
            <Database style={{ color: "#000000" }} size={22} /> Sibyl 5-Tier
            Memory Architecture Inspector
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#333333",
              marginTop: "2px",
              fontWeight: 700,
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
              className="neo-input"
              style={{ paddingLeft: "32px", width: "220px" }}
            />
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                color: "#000000",
              }}
            />
          </div>
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
            marginBottom: "14px",
            border: "2px solid #000000",
            boxShadow: "3px 3px 0px #000000",
            flexShrink: 0,
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
          marginBottom: "12px",
          flexShrink: 0,
        }}
      >
        {[
          {
            id: "warm",
            label: `WARM Entities (${memoryDump?.warm_entities?.length || 0})`,
            bg: "var(--neo-yellow)",
          },
          {
            id: "cold",
            label: `COLD Journal (${memoryDump?.cold_journal?.length || 0})`,
            bg: "var(--neo-cyan)",
          },
          { id: "hot", label: "HOT State", bg: "var(--neo-green)" },
          { id: "reference", label: "REFERENCE Docs", bg: "var(--neo-purple)" },
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

      {/* TIER CONTENTS INTERNAL SCROLL */}
      <div
        className="scrollable-internal"
        style={{ flex: 1, paddingRight: "4px" }}
      >
        {memoryTierTab === "warm" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
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
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {memoryDump?.cold_journal?.map((j, idx) => (
              <div
                key={idx}
                style={{
                  background: "#ffffff",
                  padding: "12px",
                  border: "2px solid #000000",
                  boxShadow: "2px 2px 0px #000000",
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
              padding: "14px",
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
                padding: "12px",
                border: "2px solid #000000",
                fontWeight: 700,
              }}
            >
              {JSON.stringify(memoryDump?.hot_state, null, 2)}
            </pre>
          </div>
        )}

        {memoryTierTab === "reference" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {memoryDump?.reference_docs?.map(
              (doc, idx) =>
                doc && (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      padding: "14px",
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
    </div>
  );
};
