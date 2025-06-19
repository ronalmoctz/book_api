import type { Publisher } from "../interfaces/publisher.js";
import { PublisherSchema } from "../schemas/publisher.js";
import { safeParse } from "valibot";

export class PublisherModel {
    constructor(
        public readonly id: number,
        public name: string,
        public address: string | null,
        public phone: string | null,
        public email: string | null,
        public created_at: Date,
        public updated_at: Date
    ) { }

    static fromRow(row: unknown): PublisherModel {
        const result = safeParse(PublisherSchema, row)

        if (!result.success) {
            throw new Error(`Invalid Publisher data: ${JSON.stringify(result.issues)}`);
        }

        const data = result.output;

        return new PublisherModel(
            data.id,
            data.name,
            data.address ?? null,
            data.phone ?? null,
            data.email ?? null,
            new Date(data.created_at),
            new Date(data.updated_at)
        )
    }

    toPublisher(): Publisher {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            phone: this.phone,
            email: this.email,
            created_at: this.created_at,
            updated_at: this.updated_at
        }
    }
}