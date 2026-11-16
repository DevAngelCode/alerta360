import { Pool } from "pg";

const globalForDb = globalThis;

function getSsl() {
  const val = process.env.DB_SSL;
  if (val === "true") return { rejectUnauthorized: false };
  if (val === "false") return false;
  return { rejectUnauthorized: false };
}

const pool =
  globalForDb.pgPool ||
  new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: getSsl(),
  });

pool.on("error", (err) => {
  console.error("Error inesperado en el pool de PostgreSQL:", err.message);
});

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

export default pool;

export async function query(text, params) {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error("Error de consulta a la base de datos:", error.message);
    throw error;
  }
}
