import type { PoolClient } from "@neondatabase/serverless";
import pool from '../config/database.js';
import { PublisherModel } from '../models/PublisherModel.js';
import type { Publisher, PublisherCreate, PublisherUpdate } from '../interfaces/publisher.js';
import { logger } from '../helpers/logger.js';

export class PublisherRepository {
    private async getClient(): Promise<PoolClient> {
        return await pool.connect();
    }

    async findAllPublishers(): Promise<Publisher[]> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Publisher>(`SELECT * FROM publishers`);
            return rows.map(PublisherModel.fromRow).map(p => p.toPublisher());
        } catch (error) {
            logger.error('Error fetching all publishers:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async findPublisherById(id: number): Promise<Publisher | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Publisher>(
                `SELECT * FROM publishers WHERE id = $1`,
                [id]
            );
            const row = rows[0];
            return row ? PublisherModel.fromRow(row).toPublisher() : null;
        } catch (error) {
            logger.error('Error fetching publisher by ID:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async findPublisherByName(name: string): Promise<Publisher | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Publisher>(
                `SELECT * FROM publishers WHERE name ILIKE $1`,
                [`%${name}%`]
            );
            const row = rows[0];
            return row ? PublisherModel.fromRow(row).toPublisher() : null;
        } catch (error) {
            logger.error('Error fetching publisher by name:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async createPublisher(data: PublisherCreate): Promise<Publisher> {
        const client = await this.getClient();
        try {
            const insertQuery = `
        INSERT INTO publishers (name, address, phone, email)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
            const values = [data.name, data.address, data.phone, data.email];
            const { rows } = await client.query<Publisher>(insertQuery, values);
            return PublisherModel.fromRow(rows[0]).toPublisher();
        } catch (error) {
            logger.error('Error creating publisher:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async updatePublisher(
        id: number,
        data: Partial<PublisherUpdate>
    ): Promise<Publisher | null> {
        const client = await this.getClient();
        try {
            const entries = Object.entries(data).filter(([, v]) => v !== undefined);
            if (!entries.length) return null;

            const setClauses: string[] = [];
            const params: unknown[] = [];
            entries.forEach(([key, value], idx) => {
                setClauses.push(`${key} = $${idx + 1}`);
                params.push(value);
            });
            // add updated_at and id
            params.push(id);
            const updateQuery = `
        UPDATE publishers
        SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${params.length}
        RETURNING *
      `;
            const { rows } = await client.query<Publisher>(updateQuery, params);
            const updated = rows[0];
            return updated ? PublisherModel.fromRow(updated).toPublisher() : null;
        } catch (error) {
            logger.error('Error updating publisher:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async deletePublisher(id: number): Promise<boolean> {
        const client = await this.getClient();
        try {
            const result = await client.query(
                `DELETE FROM publishers WHERE id = $1`,
                [id]
            );
            const count = result.rowCount ?? 0;
            return count > 0;
        } catch (error) {
            logger.error('Error deleting publisher:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }
}