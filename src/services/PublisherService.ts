import type {
    Publisher,
    PublisherCreate,
    PublisherUpdate,
} from '../interfaces/publisher';
import { PublisherRepository } from '../repositories/PublisherRepository';
import { NotFoundException } from '../exceptions/NotFoundException';
import { BadRequestException } from '../exceptions/BadRequestException';

export class PublisherService {
    private publishRepo = new PublisherRepository();

    /**
     * Lista todos los publishers.
     * @returns {Promise<Publisher[]>}
     */
    listPublishers(): Promise<Publisher[]> {
        return this.publishRepo.findAllPublishers()
    }

    /**
     * Obtiene un publisher por su ID. Devuelve null si no existe.
     * @param {number} id
     * @returns {Promise<Publisher|null>}
     */
    getPublisherById(id: number): Promise<Publisher | null> {
        return this.publishRepo.findPublisherById(id);
    }

    /**
     * Obtiene un publisher por su ID o lanza NotFoundException si no existe.
     * @param {number} id
     * @returns {Promise<Publisher>}
     * @throws {NotFoundException}
     */
    async getPublisherOrFail(id: number): Promise<Publisher> {
        const publisher = await this.publishRepo.findPublisherById(id);
        if (!publisher) {
            throw new NotFoundException('Publisher not found');
        }
        return publisher;
    }

    /**
     * Crea un nuevo publisher. Lanza BadRequestException si el nombre ya existe.
     * @param {PublisherCreate} input
     * @returns {Promise<Publisher>}
     * @throws {BadRequestException}
     */
    async createPublisher(input: PublisherCreate): Promise<Publisher> {
        if (input.name) {
            const existing = await this.publishRepo.findPublisherByName(input.name);
            if (existing) {
                throw new BadRequestException('El publisher ya está registrado con ese nombre');
            }
        }
        return this.publishRepo.createPublisher(input);
    }

    /**
     * Actualiza un publisher existente. Lanza BadRequestException si el nombre ya existe en otro publisher.
     * @param {number} id
     * @param {PublisherUpdate} input
     * @returns {Promise<Publisher|null>}
     * @throws {BadRequestException}
     */
    async updatePublisher(id: number, input: PublisherUpdate): Promise<Publisher | null> {
        if (input.name) {
            const existing = await this.publishRepo.findPublisherByName(input.name);
            if (existing && existing.id !== id) {
                throw new BadRequestException('Ya existe otro publisher con ese nombre');
            }
        }
        return this.publishRepo.updatePublisher(id, input);
    }

    /**
     * Elimina un publisher por su ID. Lanza NotFoundException si no existe.
     * @param {number} id
     * @returns {Promise<void>}
     * @throws {NotFoundException}
     */
    async deletePublisher(id: number): Promise<void> {
        try {
            await this.publishRepo.deletePublisher(id);
        } catch (error: any) {
            if (error.message && error.message.includes('not found')) {
                throw new NotFoundException('Publisher not found or could not be deleted');
            }
            throw error;
        }
    }
}
