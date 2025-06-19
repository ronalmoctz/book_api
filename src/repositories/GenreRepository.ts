import type { PoolClient } from "@neondatabase/serverless";
import pool from "../config/database.js";
import { GenreModel } from "../models/GenreModel.js";
import type { Genre } from "../interfaces/genre.js";
import { logger } from "../helpers/logger.js";

export class GenreRepository {
    private async getClient(): Promise<PoolClient> {
        return await pool.connect();
    }

    async findAllGenres(): Promise<Genre[]> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Genre>("SELECT * FROM genre");
            return rows.map(GenreModel.fromRow).map(g => g.toGenre());
        } catch (error) {
            logger.error("Error fetching all genres:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async findGenreById(id: number): Promise<Genre | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Genre>(
                "SELECT * FROM genre WHERE id = $1",
                [id]
            );
            const row = rows[0];
            return row ? GenreModel.fromRow(row).toGenre() : null;
        } catch (error) {
            logger.error("Error fetching genre by ID:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async findGenreByName(name: string): Promise<Genre | null> {
        const client = await this.getClient();
        try {
            const { rows } = await client.query<Genre>(
                "SELECT * FROM genre WHERE name = $1",
                [name]
            );
            const row = rows[0];
            return row ? GenreModel.fromRow(row).toGenre() : null;
        } catch (error) {
            logger.error("Error fetching genre by name:", { error, name });
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async createGenre(input: Omit<Genre, "id" | "created_at" | "updated_at">): Promise<Genre> {
        const client = await this.getClient();
        try {
            const insertQuery = `
        INSERT INTO genre (name)
        VALUES ($1)
        RETURNING *
      `;
            const { rows } = await client.query<Genre>(insertQuery, [input.name]);
            return GenreModel.fromRow(rows[0]).toGenre();
        } catch (error) {
            logger.error("Error creating genre:", error);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async updateGenre(
        id: number,
        data: Partial<Omit<Genre, "id" | "created_at">>
    ): Promise<Genre | null> {
        const client = await this.getClient();
        try {
            const updateQuery = `
        UPDATE genre
        SET name = COALESCE($1, name),
            update_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
            const { rows } = await client.query<Genre>(updateQuery, [
                data.name ?? null,
                id
            ]);
            const updated = rows[0];
            return updated ? GenreModel.fromRow(updated).toGenre() : null;
        } catch (error) {
            logger.error("Error updating genre:", error, id);
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }

    async deleteGenre(id: number): Promise<boolean> {
        const client = await this.getClient();
        try {
            const result = await client.query(
                "DELETE FROM genre WHERE id = $1",
                [id]
            );
            const count = result.rowCount ?? 0;
            return count > 0;
        } catch (error) {
            logger.error("Error deleting genre", { error, id });
            throw new Error("Database error");
        } finally {
            client.release();
        }
    }
}
