
import { Router } from 'express';
import { PublisherController } from '../controllers/PublisherController.js';

const router = Router();
const controller = new PublisherController();

// Listar todos los publishers
router.get('/', controller.listPublishers.bind(controller));

// Obtener uno por ID
router.get('/:id', controller.getPublisherById.bind(controller));

// Crear nuevo publisher
router.post('/', controller.createPublisher.bind(controller));

// Actualizar publisher existente
router.patch('/:id', controller.updatePublisher.bind(controller));

// Borrar publisher
router.delete('/:id', controller.deletePublisher.bind(controller));

export default router;
