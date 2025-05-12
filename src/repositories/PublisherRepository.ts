import { pool } from '../config/database';
import { PublisherModel } from '../models/PublisherModel';
import type { Publisher, PublisherCreate } from '../interfaces/publisher';
import { logger } from '../helpers/logger';


export class PublisherRepository {
    async finAllPublisher(): Promise<Publisher[]> {
        try {
            const [rows] = await pool.query('SELECT * FROM publishers');

            if (!Array.isArray(rows)) throw new Error('Expected an array from query result');

            return rows.map(PublisherModel.fromRow).map((publisher) => publisher.toPublisher());
        } catch (error) {
            logger.error('Error fetching all publishers:', error);
            throw new Error('Database error');
        }
    }

    async findPublisherById(id: number): Promise<Publisher | null> {
        try {
            const [rows] = await pool.query('SELECT * FROM publishers WHERE id = ?', [id]);

            if (!Array.isArray(rows)) throw new Error('Expected an array from query result');

            const row = rows[0];
            return row ? PublisherModel.fromRow(row).toPublisher() : null;
        } catch (error) {
            logger.error('Error fetching publisher by ID:', error);
            throw new Error('Database error');
        }
    }

    async findPublisherByName(name: string): Promise<Publisher | null> {
        try {
            const [rows] = await pool.query('SELECT * FROM publishers WHERE name = ?', [name]);
            if (!Array.isArray(rows)) throw new Error('Expected an array from query result');
            const row = rows[0];
            return row ? PublisherModel.fromRow(row).toPublisher() : null;
        } catch (error) {
            logger.error('Error fetching publisher by name:', error);
            throw new Error('Database error');
        }
    }

    async cratePublisher(publisher: PublisherCreate): Promise<Publisher> {
        try {
            const { name, address, phone, email } = publisher;
            const [result] = await pool.query(
                `INSERT INTO publishers (name, address, phone, email) VALUES (?, ?, ?, ?)`,
                [name, address, phone, email]
            );

            const insertResult = result as { insertId: number };

            return {
                id: insertResult.insertId,
                name: publisher.name,
                address: publisher.address,
                phone: publisher.phone,
                email: publisher.email,
                create_at: new Date(),
                update_at: new Date()
            }

        } catch (error) {
            logger.error('Error creating publisher:', error);
            throw new Error('Database error');
        }

    }

    async deletePublisher(id: number): Promise<void> {
        try {
            const [result] = await pool.query('DELETE FROM publishers WHERE id = ?', [id]);

            const deleteResult = result as { affectedRows: number };

            if (deleteResult.affectedRows === 0) {
                throw new Error('Publisher not found');
            }
        } catch (error) {
            logger.error('Error deleting publisher:', error);
            throw new Error('Database error');
        }
    }

    async updatePublisher(id: number, data: Partial<Omit<Publisher, 'id' | 'created_at' | 'update_at'>>): Promise<Publisher | null> {
        try {
            const { name, address, phone, email } = data;
            const [result] = await pool.query(
                `UPDATE publishers SET name = ?, address = ? , phone = ?, email = ?, update_at = ? WHERE id = ?`,
                [name, address, phone, email, new Date(), id]
            );

            const updateResult = result as { affectedRows: number };

            if (updateResult.affectedRows === 0) {
                throw new Error('Publisher not found');
            }

            return {
                id,
                name: data.name || '',
                address: data.address || '',
                phone: data.phone || '',
                email: data.email || '',
                create_at: new Date(),
                update_at: new Date()
            }
        }
        catch (error) {
            logger.error('Error updating publisher:', error);
            throw new Error('Database error');
        }
    }
}
