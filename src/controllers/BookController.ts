import type { Request, Response, NextFunction } from 'express';
import { safeParse } from 'valibot';
import { BookService } from '../services/BookService.js';
import { logger } from '../helpers/logger.js';
import {
    BookCreateSchema,
    BookUpdateSchema
} from '../schemas/book.js';
import type { BookCreate, BookUpdate } from '../interfaces/book.js';

const service = new BookService();

export class BookController {
    /**
     * Lista libros, permite búsqueda y filtrado.
     * @route GET /books
     */
    async listBooks(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('[BookController] listBooks llamado', { query: req.query });
            const { search, ...filterParams } = req.query;

            if (typeof search === 'string' && search.trim().length > 0) {
                const results = await service.searchBooks(search);
                return res.json(results);
            }

            const results = await service.getBooks(filterParams);
            return res.json(results);
        } catch (err) {
            logger.error('[BookController] Error en listBooks', { error: err });
            next(err);
        }
    }

    /**
     * Obtiene un libro por ID.
     * @route GET /books/:id
     */
    async getBookById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid book ID' });
            }

            logger.info('[BookController] getBookById llamado', { id });
            const book = await service.getBookOrFail(id);
            res.status(200).json(book);
        } catch (err) {
            logger.error('[BookController] Error en getBookById', { error: err });
            next(err);
        }
    }

    /**
     * Crea un nuevo libro.
     * @route POST /books
     */
    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('[BookController] createBook llamado', { body: req.body });

            const rawPayload = typeof req.body.payload === 'string'
                ? JSON.parse(req.body.payload)
                : {};

            if (req.file && (req.file as any).path) {
                rawPayload.cover = (req.file as any).path;
            }

            ['author_id', 'genre_id', 'publisher_id'].forEach((key) => {
                if (rawPayload[key] !== undefined) {
                    rawPayload[key] = Number(rawPayload[key]);
                }
            });

            const parsed = safeParse(BookCreateSchema, rawPayload);
            if (!parsed.success) {
                return res
                    .status(400)
                    .json({ message: 'Validation error', issues: parsed.issues });
            }

            const payload = parsed.output as BookCreate;
            const created = await service.createBook(payload);
            res.status(201).json(created);
        } catch (err) {
            logger.error('[BookController] Error en createBook', { error: err });
            next(err);
        }
    }

    /**
     * Actualiza un libro existente.
     * @route PATCH /books/:id
     */
    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid book ID' });
            }

            logger.info('[BookController] updateBook llamado', { id, body: req.body });
            const parsed = safeParse(BookUpdateSchema, req.body);
            if (!parsed.success) {
                return res.status(400).json({ message: 'Validation error', issues: parsed.issues });
            }

            const updated = await service.updateBook(id, parsed.output as BookUpdate);
            if (!updated) {
                await service.getBookOrFail(id); // lanzará NotFoundException si no existe
            }

            res.status(200).json({ message: 'Book updated successfully' });
        } catch (err) {
            logger.error('[BookController] Error en updateBook', { error: err });
            next(err);
        }
    }

    /**
     * Elimina un libro por ID.
     * @route DELETE /books/:id
     */
    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid book ID' });
            }

            logger.info('[BookController] deleteBook llamado', { id });
            await service.deleteBook(id);
            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (err) {
            logger.error('[BookController] Error en deleteBook', { error: err });
            next(err);
        }
    }
}
