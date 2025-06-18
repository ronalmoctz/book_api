import { Pool } from "@neondatabase/serverless";
import { ENV } from "./env";


export const pool = new Pool({
    connectionString: `postgresql://${ENV.PGUSER}:${ENV.PGPASSWORD}@${ENV.PGHOST}/${ENV.PGDATABASE}?sslmode=require`,
});

export async function getPgVersion() {
    const { rows } = await pool.query<{ version: string }>(`SELECT version()`);
    return rows[0].version
}

getPgVersion()
    .then(v => console.log(`PostgreSQL version:`, v))
    .catch(err => console.error('Error al conectar con la base de datos:', err));

export default pool;