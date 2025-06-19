import type { Genre, GenreCreateInput, GenreUpdateInput } from "../interfaces/genre.js";
import { GenreRepository } from "../repositories/GenreRepository.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";
import { BadRequestException } from "../exceptions/BadRequestException.js";

export class GenreService {
    private genreRepo = new GenreRepository();

    /**
     * Lista todos los géneros.
     * @returns {Promise<Genre[]>} Lista de géneros
     */
    listGenres(): Promise<Genre[]> {
        return this.genreRepo.findAllGenres();
    }

    /**
     * Obtiene un género por su ID. Devuelve null si no existe.
     * @param {number} id - ID del género
     * @returns {Promise<Genre | null>} Género encontrado o null
     */
    getGenreById(id: number): Promise<Genre | null> {
        return this.genreRepo.findGenreById(id);
    }

    /**
     * Obtiene un género por su ID o lanza NotFoundException si no existe.
     * @param {number} id - ID del género
     * @returns {Promise<Genre>} Género encontrado
     * @throws {NotFoundException} Si el género no existe
     */
    async getGenreOrFail(id: number): Promise<Genre> {
        const genre = await this.genreRepo.findGenreById(id);
        if (!genre) {
            throw new NotFoundException("Género no encontrado");
        }
        return genre;
    }

    /**
     * Crea un nuevo género. Lanza BadRequestException si el nombre ya existe.
     * @param {GenreCreateInput} input - Datos del género
     * @returns {Promise<Genre>} Género creado
     * @throws {BadRequestException} Si el nombre ya está registrado
     */
    async createGenre(input: GenreCreateInput): Promise<Genre> {
        if (input.name) {
            const existing = await this.genreRepo.findGenreByName(input.name);
            if (existing) {
                throw new BadRequestException("El género ya está registrado con ese nombre");
            }
        }
        return this.genreRepo.createGenre(input);
    }

    /**
     * Actualiza un género existente. Lanza BadRequestException si el nombre ya existe en otro género.
     * @param {number} id - ID del género
     * @param {GenreUpdateInput} input - Datos a actualizar
     * @returns {Promise<Genre | null>} Género actualizado o null si no existe
     * @throws {BadRequestException} Si el nombre ya está registrado en otro género
     */
    async updateGenre(id: number, input: GenreUpdateInput): Promise<Genre | null> {
        if (input.name) {
            const existing = await this.genreRepo.findGenreByName(input.name);
            if (existing && existing.id !== id) {
                throw new BadRequestException("Ya existe otro género con ese nombre");
            }
        }
        return this.genreRepo.updateGenre(id, input);
    }

    /**
     * Elimina un género por su ID. Lanza NotFoundException si no existe.
     * @param {number} id - ID del género
     * @returns {Promise<void>}
     * @throws {NotFoundException} Si el género no existe o no pudo ser eliminado
     */
    async deleteGenre(id: number): Promise<void> {
        const deleted = await this.genreRepo.deleteGenre(id);
        if (!deleted) {
            throw new NotFoundException("Género no encontrado o no pudo ser eliminado");
        }
    }
}