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
        public created_at: Date,
        public updated_at: Date
    ) { }

    static fromRow(row: any): BookModel {
        // Normalizar datos que PostgreSQL puede devolver como strings
        const normalizedRow = {
            ...row,
            // Convertir números que vienen como strings
            price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
            rating: typeof row.rating === 'string' ? parseFloat(row.rating) : row.rating,
            discount: typeof row.discount === 'string' ? parseInt(row.discount, 10) : row.discount,
            year: typeof row.year === 'string' ? parseInt(row.year, 10) : row.year,
            stock: typeof row.stock === 'string' ? parseInt(row.stock, 10) : row.stock,
            sales: typeof row.sales === 'string' ? parseInt(row.sales, 10) : row.sales,
            author_id: typeof row.author_id === 'string' ? parseInt(row.author_id, 10) : row.author_id,
            genre_id: typeof row.genre_id === 'string' ? parseInt(row.genre_id, 10) : row.genre_id,
            publisher_id: typeof row.publisher_id === 'string' ? parseInt(row.publisher_id, 10) : row.publisher_id,
            // Manejar booleanos (pueden venir como string 'true'/'false' o como número 0/1)
            is_best_seller: typeof row.is_best_seller === 'string'
                ? row.is_best_seller === 'true' || row.is_best_seller === 't'
                : typeof row.is_best_seller === 'number'
                    ? Boolean(row.is_best_seller)
                    : row.is_best_seller
        };

        const result = safeParse(BookSchema, normalizedRow);

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
            new Date(data.created_at),
            new Date(data.updated_at)
        );
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
            created_at: this.created_at,
            updated_at: this.updated_at
        };
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
            new Date(book.created_at),
            new Date(book.updated_at)
        );
    }
}