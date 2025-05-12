import { BookRepository } from '../repositories/BookRepository';
import type { Book, BookCreate, BookUpdate } from '../interfaces/book';
import { NotFoundException } from '../exceptions/NotFoundException';
import { BadRequestException } from '../exceptions/BadRequestException';

export class BookService {
    private repo = new BookRepository();

    /**
     * Obtiene libros según filtros.
     * @param {unknown} rawFilters
     * @returns {Promise<Book[]>}
     */
    async getBooks(rawFilters: unknown): Promise<Book[]> {
        return this.repo.getBooksByFilters(rawFilters);
    }

    /**
     * Busca libros por término.
     * @param {string} term
     * @returns {Promise<Book[]>}
     */
    async searchBooks(term: string): Promise<Book[]> {
        return this.repo.searchBook(term);
    }

    /**
     * Obtiene todos los libros.
     * @returns {Promise<Book[]>}
     */
    getAllBooks(): Promise<Book[]> {
        return this.repo.getAllBooks();
    }

    /**
     * Obtiene un libro por ID. Devuelve null si no existe.
     * @param {number} id
     * @returns {Promise<Book|null>}
     */
    getBookById(id: number): Promise<Book | null> {
        return this.repo.getBookById(id);
    }

    /**
     * Obtiene un libro por ID o lanza NotFoundException si no existe.
     * @param {number} id
     * @returns {Promise<Book>}
     * @throws {NotFoundException}
     */
    async getBookOrFail(id: number): Promise<Book> {
        const book = await this.repo.getBookById(id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    /**
     * Crea un nuevo libro. Lanza BadRequestException si el título ya existe.
     * @param {BookCreate} input
     * @returns {Promise<Book>}
     * @throws {BadRequestException}
     */
    async createBook(input: BookCreate): Promise<Book> {
        if (input.title) {
            const existing = await this.repo.searchBook(input.title);
            if (existing && existing.length > 0 && existing.some(b => b.title === input.title)) {
                throw new BadRequestException('Ya existe un libro con ese título');
            }
        }
        return this.repo.createBook(input);
    }

    /**
     * Actualiza un libro existente. Lanza BadRequestException si el título ya existe en otro libro.
     * @param {number} id
     * @param {BookUpdate} input
     * @returns {Promise<boolean>}
     * @throws {BadRequestException}
     */
    async updateBook(id: number, input: BookUpdate): Promise<boolean> {
        if (input.title) {
            const existing = await this.repo.searchBook(input.title);
            if (existing && existing.length > 0 && existing.some(b => b.title === input.title && b.id !== id)) {
                throw new BadRequestException('Ya existe otro libro con ese título');
            }
        }
        return this.repo.updateBook(id, input);
    }

    /**
     * Elimina un libro por su ID. Lanza NotFoundException si no existe.
     * @param {number} id
     * @returns {Promise<boolean>}
     * @throws {NotFoundException}
     */
    async deleteBook(id: number): Promise<boolean> {
        const deleted = await this.repo.deleteBook(id);
        if (!deleted) {
            throw new NotFoundException('Book not found');
        }
        return deleted;
    }
}
