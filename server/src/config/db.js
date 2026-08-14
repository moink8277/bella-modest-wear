const mysql = require('mysql2/promise');
const env = require('./env');

/**
 * Shared MySQL connection pool. Use `pool.execute(...)` (parameterized
 * queries) everywhere — never string-concatenate SQL.
 */
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error.message };
  }
}

module.exports = { pool, testConnection };
