import { pool } from "../config/database";
import { AuthorModel } from "../models/AuthorModel";
import type { Author, AuthorCreateInput, AuthorUpdateInput } from "../interfaces/author";
import { logger } from "../helpers/logger";

export class AuthorRepository {
    async findAllAuthors(): Promise<Author[]> {
        try {
            const [rows] = await pool.query("SELECT * FROM authors");

            if (!Array.isArray(rows)) throw new Error("Expected an array from query result");

            return rows.map(AuthorModel.fromRow).map((author) => author.toAuthor());
        }
        catch (error) {
            logger.error("Error fetching all authors:", error);
            throw new Error("Database error");
        }
    }

    async findAuthorById(id: number): Promise<Author | null> {
        try {
            const [rows] = await pool.query("SELECT * FROM authors WHERE id = ?", [id]);

            if (!Array.isArray(rows)) throw new Error("Expected an array from query result");

            const row = rows[0];
            return row ? AuthorModel.fromRow(row).toAuthor() : null;
        }
        catch (error) {
            logger.error("Error fetching author by ID:", error);
            throw new Error("Database error");
        }
    }

    async findAuthorByName(name: string): Promise<Author | null> {
        try {
            const [rows] = await pool.query("SELECT * FROM authors WHERE name = ?", [name])

            if (!Array.isArray(rows)) throw new Error("Expected an array from query result");

            const row = rows[0];
            return row ? AuthorModel.fromRow(row).toAuthor() : null;

        } catch (error) {
            logger.error("Error fetching author by name:", { error, name });
            throw new Error("Database error");
        }
    }

    async createAuthor(author: AuthorCreateInput): Promise<Author> {
        try {
            const { name, last_name, bio, birth_date } = author;
            const [result] = await pool.query(
                `INSERT INTO authors (name, last_name, bio, birth_date) VALUES (?, ?, ?, ?)`,
                [name, last_name, bio ?? null, birth_date ?? null]
            );
            const insertResult = result as { insertId: number };
            const [rows] = await pool.query("SELECT * FROM authors WHERE id = ?", [insertResult.insertId]);
            if (!Array.isArray(rows) || !rows[0]) throw new Error("Author not found after insert");
            return AuthorModel.fromRow(rows[0]).toAuthor();
        }
        catch (error) {
            logger.error("Error creating author:", error);
            throw new Error("Database error");
        }
    }

    async updateAuthor(id: number, author: AuthorUpdateInput): Promise<Author | null> {
        try {
            const { name, last_name, bio, birth_date } = author;
            const [result] = await pool.query(
                `UPDATE authors SET name = COALESCE(?, name), last_name = COALESCE(?, last_name), bio = ?, birth_date = ?, update_at = ? WHERE id = ?`,
                [name ?? null, last_name ?? null, bio ?? null, birth_date ?? null, new Date(), id]
            );
            if ((result as any).affectedRows === 0) return null;
            const [rows] = await pool.query("SELECT * FROM authors WHERE id = ?", [id]);
            if (!Array.isArray(rows) || !rows[0]) throw new Error("Author not found after update");
            return AuthorModel.fromRow(rows[0]).toAuthor();
        }
        catch (error) {
            logger.error("Error updating author:", error);
            throw new Error("Database error");
        }
    }

    async deleteAuthor(id: number): Promise<boolean> {
        try {
            const [result] = await pool.query("DELETE FROM authors WHERE id = ?", [id]);
            return (result as any).affectedRows > 0;
        }
        catch (error) {
            logger.error("Error deleting author:", error);
            throw new Error("Database error");
        }
    }
}