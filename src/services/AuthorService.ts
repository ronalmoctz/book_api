import { AuthorRepository } from "../repositories/AuthorRepository.js";
import type { Author, AuthorCreateInput, AuthorUpdateInput } from "../interfaces/author.js";
import { BadRequestException } from "../exceptions/BadRequestException.js";
import { NotFoundException } from "../exceptions/NotFoundException.js";

export class AuthorService {
    private authorRepo = new AuthorRepository();

    /**
     * Obtiene todos los autores registrados.
     * @returns {Promise<Author[]>} Lista de autores
     */
    async listAuthors(): Promise<Author[]> {
        return this.authorRepo.findAllAuthors()
    }

    /**
     * Busca un autor por su ID. Devuelve null si no existe.
     * @param {number} id - ID del autor
     * @returns {Promise<Author | null>} Autor encontrado o null
     */
    async getAuthorById(id: number): Promise<Author | null> {
        return this.authorRepo.findAuthorById(id);
    }

    /**
     * Busca un autor por su nombre. Devuelve null si no existe.
     * @param {string} name - Nombre del autor
     * @returns {Promise<Author | null>} Autor encontrado o null
     */
    async findAuthorByName(name: string): Promise<Author | null> {
        return this.authorRepo.findAuthorByName(name);
    }

    /**
     * Obtiene un autor por su ID o lanza NotFoundException si no existe.
     * @param {number} id - ID del autor
     * @returns {Promise<Author>} Autor encontrado
     * @throws {NotFoundException} Si el autor no existe
     */
    async getAuthorOrFail(id: number): Promise<Author> {
        const author = await this.authorRepo.findAuthorById(id);
        if (!author) {
            throw new NotFoundException("Autor no encontrado");
        }
        return author;
    }

    /**
     * Crea un nuevo autor. Lanza BadRequestException si el nombre ya existe.
     * @param {AuthorCreateInput} payload - Datos del autor
     * @returns {Promise<Author>} Autor creado
     * @throws {BadRequestException} Si el nombre ya está registrado
     */
    async createAuthor(payload: AuthorCreateInput): Promise<Author> {
        if (payload.name) {
            const existing = await this.authorRepo.findAuthorByName(payload.name);
            if (existing) {
                throw new BadRequestException("El autor ya está registrado con ese nombre");
            }
        }
        return this.authorRepo.createAuthor(payload);
    }

    /**
     * Actualiza un autor existente. Lanza BadRequestException si el nombre ya existe en otro autor.
     * @param {number} id - ID del autor
     * @param {AuthorUpdateInput} payload - Datos a actualizar
     * @returns {Promise<Author | null>} Autor actualizado o null si no existe
     * @throws {BadRequestException} Si el nombre ya está registrado en otro autor
     */
    async updateAuthor(id: number, payload: AuthorUpdateInput): Promise<Author | null> {
        if (payload.name) {
            const existing = await this.authorRepo.findAuthorByName(payload.name);
            if (existing && existing.id !== id) {
                throw new BadRequestException("Ya existe otro autor con ese nombre");
            }
        }
        return this.authorRepo.updateAuthor(id, payload);
    }

    /**
     * Elimina un autor por su ID.
     * @param {number} id - ID del autor
     * @returns {Promise<boolean>} true si fue eliminado, false si no existe
     */
    async deleteAuthor(id: number): Promise<boolean> {
        return this.authorRepo.deleteAuthor(id);
    }
}