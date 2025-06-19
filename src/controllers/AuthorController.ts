import type { Request, Response, NextFunction } from "express";
import { safeParse } from "valibot";
import { AuthorService } from "../services/AuthorService.js";
import { AuthorCreateSchema, AuthorUpdateSchema } from "../schemas/author.js";
import type { AuthorCreateInput, AuthorUpdateInput } from "../interfaces/author.js";
import { logger } from "../helpers/logger.js";

const service = new AuthorService();

export class AuthorController {
    async listAuthors(req: Request, res: Response, next: NextFunction) {
        try {
            logger.info("[AuthorController] listAuthors llamado", { query: req.query });
            const authors = await service.listAuthors();
            logger.debug("[AuthorController] listAuthors resultado", { count: authors.length });
            res.status(201).json(authors);
        } catch (error) {
            logger.error("[AuthorController] Error en listAuthors", { error });
            next(error);
        }
    }

    async getAuthorById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id)
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID" });
            }
            const author = await service.getAuthorById(id);
            if (!author) {
                return res.status(404).json({ error: "Author not found" });
            }
            res.status(200).json(author);
            logger.info("[AuthorController] getAuthorById llamado", { id });
        } catch (error) {
            logger.error("[AuthorController] Error en getAuthorById", { error });
            next(error);
        }
    }

    async findAuthorByName(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query;
            if (typeof name !== "string") {
                return res.status(400).json({ error: "Name query param is required" });
            }
            const author = await service.findAuthorByName(name);
            if (!author) {
                return res.status(404).json({ error: "Author not found" });
            }
            res.status(200).json(author);
            logger.info("[AuthorController] findAuthorByName llamado", { name });
        } catch (error) {
            logger.error("[AuthorController] Error en findAuthorByName", { error });
            next(error);
        }
    }

    async createAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = safeParse(AuthorCreateSchema, req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Validation error", issues: parsed.issues });
            }
            const payload = parsed.output as AuthorCreateInput;
            const author = await service.createAuthor(payload);
            res.status(201).json(author);
            logger.info("[AuthorController] createAuthor llamado", { author });
        }
        catch (error) {
            logger.error("[AuthorController] Error en createAuthor", { error });
            next(error);
        }
    }

    async updateAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID" });
            }
            const parsed = safeParse(AuthorUpdateSchema, req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Validation error", issues: parsed.issues });
            }
            const payload = parsed.output as AuthorUpdateInput;
            const author = await service.updateAuthor(id, payload);
            if (!author) {
                return res.status(404).json({ error: "Author not found" });
            }
            res.status(200).json(author);
            logger.info("[AuthorController] updateAuthor llamado", { id, author });
        } catch (error) {
            logger.error("[AuthorController] Error en updateAuthor", { error });
            next(error);
        }
    }

    async deleteAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID" });
            }
            const deleted = await service.deleteAuthor(id);
            if (!deleted) {
                return res.status(404).json({ error: "Author not found" });
            }
            res.status(204).send();
            logger.info("[AuthorController] deleteAuthor llamado", { id });
        } catch (error) {
            logger.error("[AuthorController] Error en deleteAuthor", { error });
            next(error);
        }
    }
}