import type { Genre } from "../interfaces/genre";
import { GenreSchema } from "../schemas/genre";
import { safeParse } from "valibot";

export class GenreModel {
    constructor(
        public readonly id: number,
        public name: string,
        public create_at: Date,
        public update_at: Date
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
            new Date(data.create_at),
            new Date(data.update_at)
        )
    }

    toGenre(): Genre {
        return {
            id: this.id,
            name: this.name,
            create_at: this.create_at,
            update_at: this.update_at
        }
    }
}