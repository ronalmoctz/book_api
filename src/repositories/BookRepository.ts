import type { PoolClient } from "@neondatabase/serverless";
import pool from '../config/database';
import { logger } from '../helpers/logger';
import type { Book, BookCreate, BookUpdate } from '../interfaces/book';
import { BookModel } from '../models/BookModel';
import { safeParse } from 'valibot';
import { BookFilterSchema } from '../schemas/bookFilter';
import type { BookFilter } from '../interfaces/bookFilter';

export class BookRepository {
    private async getClient(): Promise<PoolClient> {
        return await pool.connect();
    }

    async getAllBooks(): Promise<Book[]> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Book>('SELECT * FROM books');
            return rows.map(BookModel.fromRow).map(b => b.toBook());
        } catch (error) {
            logger.error('Error fetching all books:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async getBookById(id: number): Promise<Book | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Book>(
                'SELECT * FROM books WHERE id = $1',
                [id]
            );
            const row = rows[0];
            return row ? BookModel.fromRow(row).toBook() : null;
        } catch (error) {
            logger.error('Error fetching book by ID:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async createBook(data: BookCreate): Promise<Book> {
        const client = await this.getClient();
        try {
            const insertQuery = `
                INSERT INTO books (
                    title, description, price, discount, rating,
                    is_best_seller, cover, year, edition, stock,
                    sales, isbn, author_id, genre_id, publisher_id
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
                ) RETURNING *
            `;

            const values = [
                data.title, data.description, data.price, data.discount, data.rating,
                data.is_best_seller, data.cover, data.year, data.edition, data.stock,
                data.sales, data.isbn, data.author_id, data.genre_id, data.publisher_id
            ];

            const { rows } = await client.query<Book>(insertQuery, values);
            return BookModel.fromRow(rows[0]).toBook();
        } catch (error) {
            logger.error('Error creating book:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async updateBook(id: number, data: BookUpdate): Promise<boolean> {
        const client = await this.getClient();
        try {
            // Filtrar solo campos definidos en BookUpdate
            const entries = Object.entries(data).filter(([, v]) => v !== undefined);
            if (!entries.length) return false;

            // Construir la consulta dinámicamente
            const setClauses = entries.map(([key], index) => `${key} = $${index + 1}`);
            const values = entries.map(([, value]) => value);

            const updateQuery = `
                UPDATE books 
                SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
                WHERE id = $${values.length + 1}
            `;

            const result = await client.query(updateQuery, [...values, id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            logger.error('Error updating book:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async deleteBook(id: number): Promise<boolean> {
        const client = await this.getClient();
        try {
            const result = await client.query('DELETE FROM books WHERE id = $1', [id]);
            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            logger.error('Error deleting book:', { error, id });
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async getBooksByFilters(raw: unknown): Promise<Book[]> {
        const client = await this.getClient();
        try {
            const parsed = safeParse(BookFilterSchema, raw);
            if (!parsed.success) {
                logger.error('Invalid filter parameters', parsed.issues);
                throw new Error('Invalid filter parameters');
            }
            const filters: BookFilter = parsed.output;

            const conditions: string[] = [];
            const params: unknown[] = [];
            let paramIndex = 1;

            if (filters.title) {
                conditions.push(`title ILIKE $${paramIndex}`);
                params.push(`%${filters.title}%`);
                paramIndex++;
            }
            if (filters.authorId !== undefined) {
                conditions.push(`author_id = $${paramIndex}`);
                params.push(filters.authorId);
                paramIndex++;
            }
            if (filters.genreId !== undefined) {
                conditions.push(`genre_id = $${paramIndex}`);
                params.push(filters.genreId);
                paramIndex++;
            }
            if (filters.publisherId !== undefined) {
                conditions.push(`publisher_id = $${paramIndex}`);
                params.push(filters.publisherId);
                paramIndex++;
            }
            if (filters.minPrice !== undefined) {
                conditions.push(`price >= $${paramIndex}`);
                params.push(filters.minPrice);
                paramIndex++;
            }
            if (filters.maxPrice !== undefined) {
                conditions.push(`price <= $${paramIndex}`);
                params.push(filters.maxPrice);
                paramIndex++;
            }
            if (filters.isBestSeller !== undefined) {
                conditions.push(`is_best_seller = $${paramIndex}`);
                params.push(filters.isBestSeller);
                paramIndex++;
            }
            if (filters.minRating !== undefined) {
                conditions.push(`rating >= $${paramIndex}`);
                params.push(filters.minRating);
                paramIndex++;
            }
            if (filters.maxRating !== undefined) {
                conditions.push(`rating <= $${paramIndex}`);
                params.push(filters.maxRating);
                paramIndex++;
            }
            if (filters.minDiscount !== undefined) {
                conditions.push(`discount >= $${paramIndex}`);
                params.push(filters.minDiscount);
                paramIndex++;
            }
            if (filters.maxDiscount !== undefined) {
                conditions.push(`discount <= $${paramIndex}`);
                params.push(filters.maxDiscount);
                paramIndex++;
            }
            if (filters.year !== undefined) {
                conditions.push(`year = $${paramIndex}`);
                params.push(filters.year);
                paramIndex++;
            }

            const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
            const { rows } = await client.query<Book>(
                `SELECT * FROM books ${whereClause}`,
                params
            );

            return rows.map(BookModel.fromRow).map(b => b.toBook());
        } catch (error) {
            logger.error('Error filtering books:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }

    async searchBook(query: string): Promise<Book[]> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Book>(
                'SELECT * FROM books WHERE title ILIKE $1 OR isbn ILIKE $2',
                [`%${query}%`, `%${query}%`]
            );
            return rows.map(BookModel.fromRow).map(b => b.toBook());
        } catch (error) {
            logger.error('Error searching books:', error);
            throw new Error('Database error');
        } finally {
            client.release();
        }
    }
}