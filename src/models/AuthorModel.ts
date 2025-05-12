import type { Author } from "../interfaces/author";
import { AuthorSchema } from "../schemas/author";
import { safeParse } from "valibot";


export class AuthorModel {
    constructor(
        public readonly id: number,
        public name: string,
        public last_name: string,
        public bio: string | null,
        public birth_date: Date | null,
        public create_at: Date,
        public update_at: Date
    ) { }

    static fromRow(row: unknown): AuthorModel {
        const result = safeParse(AuthorSchema, row)

        if (!result.success) {
            throw new Error(`Invalid Author data: ${JSON.stringify(result.issues)}`);
        }

        const data = result.output;

        return new AuthorModel(
            data.id,
            data.name,
            data.last_name,
            data.bio ?? null,
            data.birth_date ?? null,
            new Date(data.create_at),
            new Date(data.update_at)
        )
    }

    toAuthor(): Author {
        return {
            id: this.id,
            name: this.name,
            last_name: this.last_name,
            bio: this.bio ?? undefined,
            birth_date: this.birth_date ?? undefined,
            create_at: this.create_at,
            update_at: this.update_at
        }
    }
}