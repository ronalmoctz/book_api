import { pool } from "../config/database";
import { GenreModel } from "../models/GenreModel";
import type { Genre } from "../interfaces/genre";
import { logger } from "../helpers/logger";


export class GenreRepository {
    async findAllGenres(): Promise<Genre[]> {
        try {
            const [rows] = await pool.query("SELECT * FROM genre");

            if (!Array.isArray(rows)) throw new Error("Expected an array from query result");

            return rows.map(GenreModel.fromRow).map((genre) => genre.toGenre());
        }
        catch (error) {
            logger.error("Error fetching all genres:", error);
            throw new Error("Database error");
        }
    }

    async findGenreById(id: number): Promise<Genre | null> {
        try {
            const [rows] = await pool.query("SELECT * FROM genre WHERE id = ?", [id]);

            if (!Array.isArray(rows)) throw new Error("Expected an array from query result");

            const row = rows[0];
            return row ? GenreModel.fromRow(row).toGenre() : null;
        }
        catch (error) {
            console.error("Error fetching genre by ID:", error);
            throw new Error("Database error");
        }
    }

    async findGenreByName(name: string): Promise<Genre | null> {
        try {
            const [rows] = await pool.query("SELECT * FROM genre WHERE name = ?", [name])

            if (!Array.isArray(rows)) throw new Error("Expected an array from query result");

            const row = rows[0];
            return row ? GenreModel.fromRow(row).toGenre() : null;

        } catch (error) {
            logger.error("Error fetching genre by name:", { error, name });
            throw new Error("Database error");
        }
    }

    async createGenre(genre: Omit<Genre, "id" | "create_at" | "update_at">): Promise<Genre> {
        try {
            const { name } = genre;
            const [result] = await pool.query(
                `INSERT INTO genre (name) VALUES (?)`,
                [name]
            )

            const insertResult = result as { insertId: number };

            return {
                id: insertResult.insertId,
                ...genre,
                create_at: new Date(),
                update_at: new Date()
            }
        }
        catch (error) {
            logger.error("Error creating genre:", error);
            throw new Error("Database error");
        }
    }

    async updateGenre(id: number, data: Partial<Omit<Genre, "id" | "create_at">>): Promise<Genre | null> {
        try {
            const { name } = data;
            const [result] = await pool.query(
                "UPDATE genre SET name = ?, update_at = CURRENT_TIMESTAMP WHERE id = ?",
                [name, id]
            );

            const updateResult = result as { affectedRows: number };
            if (updateResult.affectedRows === 0) return null;
            // Obtener el género actualizado
            return this.findGenreById(id);
        } catch (error) {
            logger.error("Error updating genre:", error, id);
            throw new Error("Database error");
        }
    }

    async deleteGenre(id: number): Promise<boolean> {
        try {
            const [result] = await pool.query(
                "DELETE FROM genre WHERE id = ?", [id]
            );

            const deleteResult = result as { affectedRows: number };

            return deleteResult.affectedRows > 0;
        } catch (error) {
            logger.error("Error deleting genre", { error, id });
            throw new Error("Database error");
        }
    }
}