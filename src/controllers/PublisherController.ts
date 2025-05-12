import type { Request, Response, NextFunction } from 'express';
import { safeParse } from 'valibot';
import {
    PublisherCreateSchema,
    PublisherUpdateSchema
} from '../schemas/publisher';
import type {
    PublisherCreate,
    PublisherUpdate
} from '../interfaces/publisher';
import { PublisherService } from '../services/PublisherService';
import { logger } from '../helpers/logger';

const service = new PublisherService();

export class PublisherController {
    /**
     * Obtiene la lista de publishers.
     * @route GET /publishers
     */
    async listPublishers(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('[PublisherController] listPublishers llamado');
            const publishers = await service.listPublishers();
            res.status(200).json(publishers);
        } catch (err) {
            logger.error('[PublisherController] Error en listPublishers', { error: err });
            next(err);
        }
    }

    /**
     * Obtiene un publisher por ID.
     * @route GET /publishers/:id
     */
    async getPublisherById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid publisher ID' });
            }
            logger.info('[PublisherController] getPublisherById llamado', { id });
            const publisher = await service.getPublisherOrFail(id);
            res.status(200).json(publisher);
        } catch (err) {
            logger.error('[PublisherController] Error en getPublisherById', { error: err });
            next(err);
        }
    }

    /**
     * Crea un nuevo publisher.
     * @route POST /publishers
     */
    async createPublisher(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info('[PublisherController] createPublisher llamado', { body: req.body });
            const parsed = safeParse(PublisherCreateSchema, req.body);
            if (!parsed.success) {
                return res
                    .status(400)
                    .json({ message: 'Validation error', issues: parsed.issues });
            }
            const payload = parsed.output as PublisherCreate;
            const created = await service.createPublisher(payload);
            res.status(201).json(created);
        } catch (err) {
            logger.error('[PublisherController] Error en createPublisher', { error: err });
            next(err);
        }
    }

    /**
     * Actualiza un publisher existente.
     * @route PATCH /publishers/:id
     */
    async updatePublisher(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid publisher ID' });
            }
            logger.info('[PublisherController] updatePublisher llamado', { id, body: req.body });
            const parsed = safeParse(PublisherUpdateSchema, req.body);
            if (!parsed.success) {
                return res
                    .status(400)
                    .json({ message: 'Validation error', issues: parsed.issues });
            }
            const payload = parsed.output as PublisherUpdate;
            const updated = await service.updatePublisher(id, payload);
            if (!updated) {
                await service.getPublisherOrFail(id); // lanzará NotFoundException si no existe
            }
            res.status(200).json({ message: 'Publisher updated successfully' });
        } catch (err) {
            logger.error('[PublisherController] Error en updatePublisher', { error: err });
            next(err);
        }
    }

    /**
     * Elimina un publisher por ID.
     * @route DELETE /publishers/:id
     */
    async deletePublisher(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id)) {
                return res.status(400).json({ message: 'Invalid publisher ID' });
            }
            logger.info('[PublisherController] deletePublisher llamado', { id });
            await service.deletePublisher(id);
            res.status(200).json({ message: 'Publisher deleted successfully' });
        } catch (err) {
            logger.error('[PublisherController] Error en deletePublisher', { error: err });
            next(err);
        }
    }
}
