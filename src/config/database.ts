import { createPool } from "mysql2/promise";
import type { Pool } from "mysql2/promise";
import { ENV } from './env';

export const pool: Pool = createPool({
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    decimalNumbers: true
})

export const connectDB = async (): Promise<void> => {
    try {
        const connection = await pool.getConnection();
        console.log(`Connected to database: ${ENV.DB_NAME} on ${ENV.DB_HOST}:${ENV.DB_PORT}`);
        connection.release();
    } catch (error) {
        console.error(`Error connecting to database: ${ENV.DB_NAME}`, error);
        process.exit(1);
    }
}
