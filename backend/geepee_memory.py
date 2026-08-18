import json
import os
import sqlite3
from typing import Any

# Attempt to import official sibyl_memory_client if available
try:
    from sibyl_memory_client import MemoryClient as OfficialMemoryClient
    OFFICIAL_SDK_AVAILABLE = True
except ImportError:
    OFFICIAL_SDK_AVAILABLE = False


class GeePeeMemoryEngine:
    """
    Sibyl 5-Tier Memory Architecture Engine for gEEpEE.
    Implements local-first SQLite + FTS5 full-text search across:
      1. HOT: Active working state (key-value)
      2. WARM: Structured entity knowledge graph UNIQUE(category, name)
      3. COLD: Time-series sequential event journal
      4. REFERENCE: Immutable contract specifications & strategy docs
      5. ARCHIVE: Preserved historical or deactivated memory items
    """
    def __init__(self, db_path: str = None):
        if not db_path:
            base_dir = os.path.expanduser("~/.sibyl-memory")
            os.makedirs(base_dir, exist_ok=True)
            db_path = os.path.join(base_dir, "geepee_memory.db")
        
        self.db_path = db_path
        self.load_bearing_enabled = True # For Litmus Gate testing
        self._init_db()
        
        # Initialize official Sibyl client if installed
        self.official_client = None
        if OFFICIAL_SDK_AVAILABLE:
            try:
                self.official_client = OfficialMemoryClient.local(self.db_path)
            except Exception as e:
                print(f"[gEEpEE Memory] Official SDK init notice: {e}")

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            
            # Tier 1: HOT State (Working State)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS hot_state (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Tier 2: WARM Entities (Knowledge Graph with Schema-level UNIQUE constraint)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS warm_entities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tenant_id TEXT DEFAULT 'geepee_default',
                    category TEXT NOT NULL,
                    name TEXT NOT NULL,
                    body TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(tenant_id, category, name)
                )
            """)
            
            # Tier 3: COLD Journal (Sequential Event Log)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cold_journal (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tenant_id TEXT DEFAULT 'geepee_default',
                    action TEXT NOT NULL,
                    details TEXT,
                    tx_hash TEXT,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Tier 4: REFERENCE Documents
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS reference_docs (
                    key TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # Tier 5: ARCHIVE (Frozen Memories)
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS archive_entities (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tenant_id TEXT DEFAULT 'geepee_default',
                    category TEXT NOT NULL,
                    name TEXT NOT NULL,
                    body TEXT NOT NULL,
                    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

            # FTS5 Full Text Search Table across all entities & journal
            try:
                cursor.execute("""
                    CREATE VIRTUAL TABLE IF NOT EXISTS fts_memory USING fts5(
                        category,
                        name,
                        content
                    )
                """)
            except Exception:
                pass # SQLite version without FTS5 fallback handled in query
                
            conn.commit()

    # ------------------ HOT STATE ------------------
    def set_state(self, key: str, value: Any):
        if not self.load_bearing_enabled:
            return
        val_str = json.dumps(value) if isinstance(value, (dict, list)) else str(value)
        with self._get_connection() as conn:
            conn.cursor().execute("""
                INSERT INTO hot_state (key, value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
            """, (key, val_str))
            conn.commit()

    def get_state(self, key: str, default: Any = None) -> Any:
        if not self.load_bearing_enabled:
            return default
        with self._get_connection() as conn:
            row = conn.cursor().execute("SELECT value FROM hot_state WHERE key=?", (key,)).fetchone()
            if row:
                try:
                    return json.loads(row['value'])
                except Exception:
                    return row['value']
            return default

    # ------------------ WARM ENTITIES ------------------
    def set_entity(self, category: str, name: str, body: dict[str, Any], tenant_id: str = "geepee_default"):
        if not self.load_bearing_enabled:
            return
        
        body_json = json.dumps(body)
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO warm_entities (tenant_id, category, name, body, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(tenant_id, category, name) DO UPDATE SET
                    body=excluded.body,
                    updated_at=CURRENT_TIMESTAMP
            """, (tenant_id, category, name, body_json))
            
            # Sync to FTS5
            try:
                cursor.execute("""
                    INSERT INTO fts_memory (category, name, content)
                    VALUES (?, ?, ?)
                """, (category, name, f"{category} {name} {body_json}"))
            except Exception:
                pass
                
            conn.commit()
            
        if self.official_client:
            try:
                self.official_client.set_entity(category, name, body)
            except Exception:
                pass

    def get_entity(self, category: str, name: str, tenant_id: str = "geepee_default") -> dict[str, Any] | None:
        if not self.load_bearing_enabled:
            return None
            
        with self._get_connection() as conn:
            row = conn.cursor().execute("""
                SELECT body FROM warm_entities WHERE tenant_id=? AND category=? AND name=?
            """, (tenant_id, category, name)).fetchone()
            if row:
                return json.loads(row['body'])
            return None

    def list_entities(self, category: str | None = None, tenant_id: str = "geepee_default") -> list[dict[str, Any]]:
        if not self.load_bearing_enabled:
            return []
            
        with self._get_connection() as conn:
            if category:
                rows = conn.cursor().execute("""
                    SELECT category, name, body, updated_at FROM warm_entities WHERE tenant_id=? AND category=? ORDER BY updated_at DESC
                """, (tenant_id, category)).fetchall()
            else:
                rows = conn.cursor().execute("""
                    SELECT category, name, body, updated_at FROM warm_entities WHERE tenant_id=? ORDER BY updated_at DESC
                """, (tenant_id,)).fetchall()
            
            return [
                {
                    "category": r["category"],
                    "name": r["name"],
                    "body": json.loads(r["body"]),
                    "updated_at": r["updated_at"]
                }
                for r in rows
            ]

    # ------------------ COLD JOURNAL ------------------
    def write_event(self, action: str, details: Any = None, tx_hash: str | None = None, tenant_id: str = "geepee_default"):
        if not self.load_bearing_enabled:
            return
            
        det_str = json.dumps(details) if isinstance(details, (dict, list)) else (str(details) if details else "")
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO cold_journal (tenant_id, action, details, tx_hash, timestamp)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (tenant_id, action, det_str, tx_hash))
            
            try:
                cursor.execute("""
                    INSERT INTO fts_memory (category, name, content)
                    VALUES ('journal', ?, ?)
                """, (action, f"{action} {det_str} {tx_hash or ''}"))
            except Exception:
                pass
                
            conn.commit()

        if self.official_client:
            try:
                self.official_client.write_event(acted=[f"{action}: {det_str}"])
            except Exception:
                pass

    def read_events(self, limit: int = 20, tenant_id: str = "geepee_default") -> list[dict[str, Any]]:
        if not self.load_bearing_enabled:
            return []
            
        with self._get_connection() as conn:
            rows = conn.cursor().execute("""
                SELECT action, details, tx_hash, timestamp FROM cold_journal WHERE tenant_id=? ORDER BY timestamp DESC LIMIT ?
            """, (tenant_id, limit)).fetchall()
            
            res = []
            for r in rows:
                det = r["details"]
                try:
                    det = json.loads(det)
                except Exception:
                    pass
                res.append({
                    "action": r["action"],
                    "details": det,
                    "tx_hash": r["tx_hash"],
                    "timestamp": r["timestamp"]
                })
            return res

    # ------------------ REFERENCE DOCS ------------------
    def set_reference(self, key: str, title: str, content: str):
        if not self.load_bearing_enabled:
            return
        with self._get_connection() as conn:
            conn.cursor().execute("""
                INSERT INTO reference_docs (key, title, content, updated_at)
                VALUES (?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET title=excluded.title, content=excluded.content, updated_at=CURRENT_TIMESTAMP
            """, (key, title, content))
            conn.commit()

    def get_reference(self, key: str) -> dict[str, str] | None:
        if not self.load_bearing_enabled:
            return None
        with self._get_connection() as conn:
            row = conn.cursor().execute("SELECT title, content, updated_at FROM reference_docs WHERE key=?", (key,)).fetchone()
            if row:
                return {"title": row["title"], "content": row["content"], "updated_at": row["updated_at"]}
            return None

    # ------------------ ARCHIVE ------------------
    def archive_entity(self, category: str, name: str, tenant_id: str = "geepee_default") -> bool:
        if not self.load_bearing_enabled:
            return False
            
        with self._get_connection() as conn:
            cursor = conn.cursor()
            entity = cursor.execute("""
                SELECT body FROM warm_entities WHERE tenant_id=? AND category=? AND name=?
            """, (tenant_id, category, name)).fetchone()
            
            if not entity:
                return False
                
            cursor.execute("""
                INSERT INTO archive_entities (tenant_id, category, name, body)
                VALUES (?, ?, ?, ?)
            """, (tenant_id, category, name, entity['body']))
            
            cursor.execute("""
                DELETE FROM warm_entities WHERE tenant_id=? AND category=? AND name=?
            """, (tenant_id, category, name))
            
            conn.commit()
            return True

    # ------------------ FTS5 SEARCH ------------------
    def search_memory(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        if not self.load_bearing_enabled:
            return []
            
        with self._get_connection() as conn:
            try:
                rows = conn.cursor().execute("""
                    SELECT category, name, content FROM fts_memory WHERE fts_memory MATCH ? LIMIT ?
                """, (f"{query}*", limit)).fetchall()
                return [{"category": r["category"], "name": r["name"], "snippet": r["content"]} for r in rows]
            except Exception:
                # Fallback LIKE search
                rows = conn.cursor().execute("""
                    SELECT category, name, body as content FROM warm_entities WHERE body LIKE ? OR name LIKE ? LIMIT ?
                """, (f"%{query}%", f"%{query}%", limit)).fetchall()
                return [{"category": r["category"], "name": r["name"], "snippet": r["content"]} for r in rows]

    # ------------------ DEMO & GATE HELPER METHODS ------------------
    def get_full_stats(self) -> dict[str, Any]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            hot_count = cursor.execute("SELECT COUNT(*) FROM hot_state").fetchone()[0]
            warm_count = cursor.execute("SELECT COUNT(*) FROM warm_entities").fetchone()[0]
            cold_count = cursor.execute("SELECT COUNT(*) FROM cold_journal").fetchone()[0]
            ref_count = cursor.execute("SELECT COUNT(*) FROM reference_docs").fetchone()[0]
            arc_count = cursor.execute("SELECT COUNT(*) FROM archive_entities").fetchone()[0]
            
            size_bytes = os.path.getsize(self.db_path) if os.path.exists(self.db_path) else 0
            
            return {
                "load_bearing_enabled": self.load_bearing_enabled,
                "db_path": self.db_path,
                "db_size_kb": round(size_bytes / 1024, 2),
                "counts": {
                    "hot_state": hot_count,
                    "warm_entities": warm_count,
                    "cold_journal": cold_count,
                    "reference_docs": ref_count,
                    "archive_entities": arc_count
                }
            }

    def seed_initial_knowledge(self):
        """Seeds default gEEpEE strategies, Base network config, and Virtuals ACP specs."""
        self.set_reference(
            "base_network_spec",
            "Base Network Chain Configuration",
            "Base Mainnet (Chain ID 8453) / Base Sepolia (Chain ID 84532). Native token ETH. DEX: Aerodrome / Uniswap V3 on Base. Fast block time 2s."
        )
        
        self.set_reference(
            "virtuals_acp_spec",
            "Virtuals Protocol Agent Communication Protocol Specification",
            "ACP Job structure: job_id, requester_agent, payload (target_pair, target_allocation, slippage_tolerance), signature, status."
        )

        self.set_entity(
            "user_strategy",
            "default_profile",
            {
                "user_name": "Hackathon Judge",
                "risk_tolerance": "moderate",
                "target_tokens": ["USDC", "WETH", "AERO", "VIRTUAL"],
                "target_allocation": {"USDC": 40, "WETH": 35, "AERO": 15, "VIRTUAL": 10},
                "max_slippage_pct": 0.5,
                "rebalance_threshold_pct": 3.0,
                "stop_loss_pct": 5.0,
                "x402_feed_enabled": True
            }
        )
        
        self.write_event("system_boot", {"status": "gEEpEE Agent memory engine initialized", "version": "1.0.0"})
