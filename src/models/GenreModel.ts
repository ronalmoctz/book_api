import type { Genre } from "../interfaces/genre";
import { GenreSchema } from "../schemas/genre";
import { safeParse } from "valibot";

export class GenreModel {
    constructor(
        public readonly id: number,
        public name: string,
        public created_at: Date,
        public updated_at: Date
    ) { }

    static fromRow(row: unknown): GenreModel {
        const result = safeParse(GenreSchema, row)

        if (!result.success) {
            throw new Error(`Invalid Genre data: ${JSON.stringify(result.issues)}`);
        }

        const data = result.output;

        return new GenreModel(
            data.id,
            data.name,
            new Date(data.created_at),
            new Date(data.updated_at)
        )
    }

    toGenre(): Genre {
        return {
            id: this.id,
            name: this.name,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}