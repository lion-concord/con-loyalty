const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : new Pool({
      host:     process.env.PGHOST,
      port:     Number(process.env.PGPORT || 5432),
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    });

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      tg_id       BIGINT PRIMARY KEY,
      username    TEXT,
      first_name  TEXT,
      last_name   TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS loyalty (
      tg_id       BIGINT PRIMARY KEY REFERENCES users(tg_id) ON DELETE CASCADE,
      points      INTEGER NOT NULL DEFAULT 0,
      level       TEXT    NOT NULL DEFAULT 'bronze',
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('DB schema ready');
}

async function upsertUser(u) {
  await pool.query(
    `INSERT INTO users (tg_id, username, first_name, last_name)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (tg_id) DO UPDATE
       SET username=EXCLUDED.username,
           first_name=EXCLUDED.first_name,
           last_name=EXCLUDED.last_name`,
    [u.id, u.username || null, u.first name || null, u.last name || null]
  );
  await pool.query(
    `INSERT INTO loyalty (tg_id) VALUES ($1) ON CONFLICT DO NOTHING`,
    [u.id]
  );
}

async function getLoyalty(tg_id) {
  const { rows } = await pool.query(
    `SELECT points, level FROM loyalty WHERE tg_id=$1`, [tg id]
  );
  return rows[0] || { points: 0, level: 'bronze' };
}

module.exports = { pool, initSchema, upsertUser, getLoyalty };
