import { Pool } from "@neondatabase/serverless";
import { ENV } from "./env";


const pool = new Pool({
    connectionString: `postgresql://${ENV.PGUSER}:${ENV.PGDATABASE}@${ENV.PGHOST}/${ENV.PGDATABASE}?sslmode=require`
})

export async function getPgVersion() {
    const { rows } = await pool.query<{ version: string }>(`SELECT verison()`)
    return rows[0].version
}

getPgVersion()
    .then(v => console.log(`PostgreSQL version:`, v))
    .then(err => console.error('Error al conectar con la base de datos:', err))

export default pool;