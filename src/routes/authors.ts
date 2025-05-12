import { Router } from 'express';
import { AuthorController } from '../controllers/AuthorController';

const controller = new AuthorController();
const router = Router();

router.get('/', controller.listAuthors.bind(controller));
router.get('/:id', controller.getAuthorById.bind(controller));
router.post('/', controller.createAuthor.bind(controller));
router.patch('/:id', controller.updateAuthor.bind(controller));
router.delete('/:id', controller.deleteAuthor.bind(controller));

export default router;