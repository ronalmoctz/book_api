import { Router } from 'express';
import { GenreController } from '../controllers/GenreController.js';

const router = Router();
const controller = new GenreController();

// Listar todos los géneros
router.get('/', controller.listGenres.bind(controller));

// Obtener uno por ID
router.get('/:id', controller.getGenreById.bind(controller));

// Crear nuevo género
router.post('/', controller.createGenre.bind(controller));

// Actualizar género existente
router.patch('/:id', controller.updateGenre.bind(controller));

// Borrar género
router.delete('/:id', controller.deleteGenre.bind(controller));

export default router;
