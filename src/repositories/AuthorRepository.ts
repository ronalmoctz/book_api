import pool from "../config/database";
import type { PoolClient } from "@neondatabase/serverless";
import type { Author, AuthorCreateInput, AuthorUpdateInput } from "../interfaces/author";
import { AuthorModel } from "../models/AuthorModel";
import { logger } from "../helpers/logger";

export class AuthorRepository {
    private async getClient(): Promise<PoolClient> {
        return await pool.connect();
    }

    async findAllAuthors(): Promise<Author[]> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Author>("SELECT * FROM authors");
            return rows.map(row => AuthorModel.fromRow(row).toAuthor());
        } catch (error) {
            logger.error("Error fetching all authors:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async findAuthorById(id: number): Promise<Author | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Author>(
                "SELECT * FROM authors WHERE id = $1",
                [id]
            );
            const row = rows[0];
            return row ? AuthorModel.fromRow(row).toAuthor() : null;
        } catch (error) {
            logger.error("Error fetching author by ID:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async findAuthorByName(name: string): Promise<Author | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Author>(
                "SELECT * FROM authors WHERE name = $1",
                [name]
            );
            const row = rows[0];
            return row ? AuthorModel.fromRow(row).toAuthor() : null;
        } catch (error) {
            logger.error("Error fetching author by name:", { error, name });
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async createAuthor(author: AuthorCreateInput): Promise<Author> {
        const client = await this.getClient();
        try {
            const { name, last_name, bio, birth_date } = author;
            const insertQuery = `
                INSERT INTO authors (name, last_name, bio, birth_date)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `;
            const { rows } = await client.query<Author>(insertQuery, [
                name,
                last_name,
                bio ?? null,
                birth_date ?? null
            ]);
            return AuthorModel.fromRow(rows[0]).toAuthor();
        } catch (error) {
            logger.error("Error creating author:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async updateAuthor(
        id: number,
        author: AuthorUpdateInput
    ): Promise<Author | null> {
        const client = await this.getClient();
        try {
            const { name, last_name, bio, birth_date } = author;
            const updateQuery = `
                UPDATE authors
                SET name = COALESCE($1, name),
                    last_name = COALESCE($2, last_name),
                    bio = $3,
                    birth_date = $4,
                    updated_at = NOW()
                WHERE id = $5
                RETURNING *
            `;
            const { rows } = await client.query<Author>(updateQuery, [
                name ?? null,
                last_name ?? null,
                bio ?? null,
                birth_date ?? null,
                id
            ]);
            const updated = rows[0];
            return updated ? AuthorModel.fromRow(updated).toAuthor() : null;
        } catch (error) {
            logger.error("Error updating author:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async deleteAuthor(id: number): Promise<boolean> {
        const client = await this.getClient();
        try {
            const result = await client.query(
                "DELETE FROM authors WHERE id = $1",
                [id]
            );
            const count = result.rowCount ?? 0;
            return count > 0;
        } catch (error) {
            logger.error("Error deleting author:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }
}