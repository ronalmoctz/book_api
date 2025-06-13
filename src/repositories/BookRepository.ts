import { pool } from '../config/database';
import { logger } from '../helpers/logger';
import type { Book, BookCreate, BookUpdate } from '../interfaces/book';
import { BookModel } from '../models/BookModel';
import { safeParse } from 'valibot';
import { BookFilterSchema } from '../schemas/bookFilter';
import type { BookFilter } from '../interfaces/bookFilter';

export class BookRepository {
    async getAllBooks(): Promise<Book[]> {
        const [rows] = await pool.query('SELECT * FROM books');
        if (!Array.isArray(rows)) throw new Error('Expected an array from query result');
        return rows.map(BookModel.fromRow).map(b => b.toBook());
    }

    async getBookById(id: number): Promise<Book | null> {
        const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        if (!Array.isArray(rows)) throw new Error('Expected an array from query result');
        const row = rows[0];
        return row ? BookModel.fromRow(row).toBook() : null;
    }

    async createBook(data: BookCreate): Promise<Book> {
        const cols = [
            'title', 'description', 'price', 'discount', 'rating',
            'is_best_seller', 'cover', 'year', 'edition', 'stock',
            'sales', 'isbn', 'author_id', 'genre_id', 'publisher_id'
        ].join(', ');
        const placeholders = new Array(15).fill('?').join(', ');
        const values = [
            data.title, data.description, data.price, data.discount, data.rating,
            data.is_best_seller, data.cover, data.year, data.edition, data.stock,
            data.sales, data.isbn, data.author_id, data.genre_id, data.publisher_id
        ];

        const [result] = await pool.query(
            `INSERT INTO books (${cols}) VALUES (${placeholders})`,
            values
        );
        const { insertId } = result as { insertId: number };
        return { id: insertId, ...data, create_at: new Date(), update_at: new Date() };
    }

    async updateBook(id: number, data: BookUpdate): Promise<boolean> {
        // sólo campos definidos en BookUpdate
        const entries = Object.entries(data).filter(([, v]) => v !== undefined);
        if (!entries.length) return false;

        const setClause = entries.map(([k]) => `${k} = ?`).join(', ');
        const values = entries.map(([, v]) => v!);

        const [result] = await pool.query(
            `UPDATE books 
            SET ${setClause}, update_at = CURRENT_TIMESTAMP 
            WHERE id = ?`,
            [...values, id]
        );
        return (result as { affectedRows: number }).affectedRows > 0;
    }

    async deleteBook(id: number): Promise<boolean> {
        const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
        return (result as { affectedRows: number }).affectedRows > 0;
    }

    async getBooksByFilters(raw: unknown): Promise<Book[]> {
        const parsed = safeParse(BookFilterSchema, raw);
        if (!parsed.success) {
            logger.error('Invalid filter parameters', parsed.issues);
            throw new Error('Invalid filter parameters');
        }
        const filters: BookFilter = parsed.output;

        const conditions: string[] = [];
        const params: unknown[] = [];

        if (filters.title) {
            conditions.push('title LIKE ?');
            params.push(`%${filters.title}%`);
        }
        if (filters.authorId !== undefined) {
            conditions.push('author_id = ?');
            params.push(filters.authorId);
        }
        if (filters.genreId !== undefined) {
            conditions.push('genre_id = ?');
            params.push(filters.genreId);
        }
        if (filters.publisherId !== undefined) {
            conditions.push('publisher_id = ?');
            params.push(filters.publisherId);
        }
        if (filters.minPrice !== undefined) {
            conditions.push('price >= ?');
            params.push(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
            conditions.push('price <= ?');
            params.push(filters.maxPrice);
        }
        if (filters.isBestSeller !== undefined) {
            conditions.push('is_best_seller = ?');
            params.push(filters.isBestSeller);
        }
        if (filters.minRating !== undefined) {
            conditions.push('rating >= ?');
            params.push(filters.minRating);
        }
        if (filters.maxRating !== undefined) {
            conditions.push('rating <= ?');
            params.push(filters.maxRating);
        }
        if (filters.minDiscount !== undefined) {
            conditions.push('discount >= ?');
            params.push(filters.minDiscount);
        }
        if (filters.maxDiscount !== undefined) {
            conditions.push('discount <= ?');
            params.push(filters.maxDiscount);
        }
        if (filters.year !== undefined) {
            conditions.push('year = ?');
            params.push(filters.year);
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const [rows] = await pool.query(`SELECT * FROM books ${where}`, params);
        if (!Array.isArray(rows)) throw new Error('Expected an array from query result');
        return rows.map(BookModel.fromRow).map(b => b.toBook());
    }

    async searchBook(query: string): Promise<Book[]> {
        const [rows] = await pool.query(
            'SELECT * FROM books WHERE title LIKE ? OR isbn LIKE ?',
            [`%${query}%`, `%${query}%`]
        );
        if (!Array.isArray(rows)) throw new Error('Expected an array from query result');
        return rows.map(BookModel.fromRow).map(b => b.toBook());
    }
}
