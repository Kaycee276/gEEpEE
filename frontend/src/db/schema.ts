import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Drizzle ORM Schemas for Turso Cloud DB & Sibyl 5-Tier Memory Architecture

export const userPortfolios = sqliteTable('user_portfolios', {
  walletAddress: text('wallet_address').primaryKey(),
  strategy: text('strategy'),
  lastBalances: text('last_balances'),
  updatedAt: text('updated_at')
});

export const warmEntities = sqliteTable('warm_entities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: text('tenant_id').default('geepee_default'),
  category: text('category').notNull(),
  name: text('name').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at'),
  updatedAt: text('updated_at')
});

export const coldJournal = sqliteTable('cold_journal', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenantId: text('tenant_id').default('geepee_default'),
  action: text('action').notNull(),
  details: text('details'),
  txHash: text('tx_hash'),
  timestamp: text('timestamp')
});

export const hotState = sqliteTable('hot_state', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at')
});
