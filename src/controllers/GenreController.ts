import type { Request, Response, NextFunction } from 'express';
import { safeParse } from 'valibot';
import {
    CreateGenreSchema,
    UpdateGenreSchema
} from '../schemas/genre.js';
import type {
    GenreCreateInput,
    GenreUpdateInput
} from '../interfaces/genre.js';
import { GenreService } from '../services/GenreService.js';
import { logger } from '../helpers/logger.js';

const service = new GenreService();

export class GenreController {
    /**
     * Obtiene la lista de géneros.
     * @route GET /genres
     */
    async listGenres(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('[GenreController] listGenres llamado');
            const genres = await service.listGenres();
            res.status(200).json(genres);
        } catch (err) {
            logger.error('[GenreController] Error en listGenres', { error: err });
            next(err);
        }
    }

    /**
     * Obtiene un género por ID.
     * @route GET /genres/:id
     */
    async getGenreById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid genre ID' });
            }
            logger.info('[GenreController] getGenreById llamado', { id });
            const genre = await service.getGenreOrFail(id);
            res.status(200).json(genre);
        } catch (err) {
            logger.error('[GenreController] Error en getGenreById', { error: err });
            next(err);
        }
    }

    /**
     * Crea un nuevo género.
     * @route POST /genres
     */
    async createGenre(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('[GenreController] createGenre llamado', { body: req.body });
            const parsed = safeParse(CreateGenreSchema, req.body);
            if (!parsed.success) {
                return res
                    .status(400)
                    .json({ message: 'Validation error', issues: parsed.issues });
            }
            const payload = parsed.output as GenreCreateInput;
            const created = await service.createGenre(payload);
            res.status(201).json(created);
        } catch (err) {
            logger.error('[GenreController] Error en createGenre', { error: err });
            next(err);
        }
    }

    /**
     * Actualiza un género existente.
     * @route PATCH /genres/:id
     */
    async updateGenre(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid genre ID' });
            }
            logger.info('[GenreController] updateGenre llamado', { id, body: req.body });
            const parsed = safeParse(UpdateGenreSchema, req.body);
            if (!parsed.success) {
                return res
                    .status(400)
                    .json({ message: 'Validation error', issues: parsed.issues });
            }
            const payload = parsed.output as GenreUpdateInput;
            const updated = await service.updateGenre(id, payload);
            if (!updated) {
                await service.getGenreOrFail(id);
            }
            res.status(200).json(updated);
        } catch (err) {
            logger.error('[GenreController] Error en updateGenre', { error: err });
            next(err);
        }
    }

    /**
     * Elimina un género por ID.
     * @route DELETE /genres/:id
     */
    async deleteGenre(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid genre ID' });
            }
            logger.info('[GenreController] deleteGenre llamado', { id });
            await service.deleteGenre(id);
            res.status(200).json({ message: 'Genre deleted successfully' });
        } catch (err) {
            logger.error('[GenreController] Error en deleteGenre', { error: err });
            next(err);
        }
    }
}
