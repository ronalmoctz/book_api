import type { Publisher } from "../interfaces/publisher";
import { PublisherSchema } from "../schemas/publisher";
import { safeParse } from "valibot";

export class PublisherModel {
    constructor(
        public readonly id: number,
        public name: string,
        public address: string | null,
        public phone: string | null,
        public email: string | null,
        public create_at: Date,
        public update_at: Date
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
            new Date(data.create_at),
            new Date(data.update_at)
        )
    }

    toPublisher(): Publisher {
        return {
            id: this.id,
            name: this.name,
            address: this.address,
            phone: this.phone,
            email: this.email,
            create_at: this.create_at,
            update_at: this.update_at
        }
    }
}