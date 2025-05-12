import type { Book } from "../interfaces/book";
import { BookSchema } from "../schemas/book";
import { safeParse } from "valibot";

export class BookModel {
    constructor(
        public readonly id: number,
        public title: string,
        public description: string,
        public price: number,
        public discount: number,
        public rating: number,
        public is_best_seller: boolean,
        public cover: string,
        public year: number,
        public edition: string | null,
        public stock: number,
        public sales: number,
        public isbn: string,
        public author_id: number,
        public genre_id: number,
        public publisher_id: number,
        public create_at: Date,
        public update_at: Date
    ) { }

    static fromRow(row: any): BookModel {
        const normalizedRow = {
            ...row,
            is_best_seller: typeof row.is_best_seller === 'number'
                ? Boolean(row.is_best_seller)
                : row.is_best_seller
        };
        const result = safeParse(BookSchema, normalizedRow)

        if (!result.success) {
            throw new Error(`Invalid Book data: ${JSON.stringify(result.issues)}`);
        }

        const data = result.output;

        return new BookModel(
            data.id,
            data.title,
            data.description,
            data.price,
            data.discount,
            data.rating,
            data.is_best_seller,
            data.cover,
            data.year,
            data.edition ?? null,
            data.stock,
            data.sales,
            data.isbn,
            data.author_id,
            data.genre_id,
            data.publisher_id,
            new Date(data.create_at),
            new Date(data.update_at)
        )
    }
    toBook(): Book {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            price: this.price,
            discount: this.discount,
            rating: this.rating,
            is_best_seller: this.is_best_seller,
            cover: this.cover,
            year: this.year,
            edition: this.edition ?? undefined,
            stock: this.stock,
            sales: this.sales,
            isbn: this.isbn,
            author_id: this.author_id,
            genre_id: this.genre_id,
            publisher_id: this.publisher_id,
            create_at: this.create_at,
            update_at: this.update_at
        }
    }
    static fromBook(book: Book): BookModel {
        return new BookModel(
            book.id,
            book.title,
            book.description,
            book.price,
            book.discount,
            book.rating,
            book.is_best_seller,
            book.cover,
            book.year,
            book.edition ?? null,
            book.stock,
            book.sales,
            book.isbn,
            book.author_id,
            book.genre_id,
            book.publisher_id,
            new Date(book.create_at),
            new Date(book.update_at)
        )
    }
}