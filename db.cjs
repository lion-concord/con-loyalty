const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000
});

pool.on('error', (err) => console.error('PG pool error:', err));

async function initSchema() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      telegram_id BIGINT PRIMARY KEY,
      username    TEXT,
      first_name  TEXT,
      kon         INTEGER NOT NULL DEFAULT 0,
      level       TEXT NOT NULL DEFAULT 'bronze',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id          SERIAL PRIMARY KEY,
      telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
      amount      INTEGER NOT NULL,
      reason      TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_tx_user ON transactions(telegram_id, created_at DESC);
  `;
  await pool.query(sql);
  console.log('DB schema ready');
}

async function getOrCreateUser(tgUser) {
  const id = tgUser.id;
  const username = tgUser.username || null;
  const firstName = tgUser.first_name || null;
  const res = await pool.query(
    "INSERT INTO users (telegram_id, username, first_name) VALUES ($1, $2, $3) ON CONFLICT (telegram_id) DO UPDATE SET username = EXCLUDED.username, first_name = EXCLUDED.first_name, updated_at = NOW() RETURNING *",
    [id, username, firstName]
  );
  return res.rows[0];
}

async function addKon(telegramId, amount, reason) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const upd = await client.query(
      "UPDATE users SET kon = kon + $2, level = CASE WHEN kon + $2 >= 10000 THEN 'platinum' WHEN kon + $2 >= 2000 THEN 'gold' WHEN kon + $2 >= 500 THEN 'silver' ELSE 'bronze' END, updated_at = NOW() WHERE telegram_id = $1 RETURNING kon, level",
      [telegramId, amount]
    );
    await client.query(
      "INSERT INTO transactions (telegram_id, amount, reason) VALUES ($1, $2, $3)",
      [telegramId, amount, reason || null]
    );
    await client.query('COMMIT');
    return upd.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { pool, initSchema, getOrCreateUser, addKon };
