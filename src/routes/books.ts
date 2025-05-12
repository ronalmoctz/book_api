import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { uploadCover } from '../middlewares/uploadCover';

const router = Router();
const controller = new BookController();

// GET /books?search=...&genreId=...  → listBooks (search o filter)
router.get('/', controller.listBooks.bind(controller));

// GET /books/:id                     → getBookById
router.get('/:id', controller.getBookById.bind(controller));

// POST /books                        → createBook
router.post('/', uploadCover.single('cover'), controller.createBook.bind(controller));

// PATCH /books/:id                   → updateBook
router.patch('/:id', controller.updateBook.bind(controller));

// DELETE /books/:id                  → deleteBook
router.delete('/:id', controller.deleteBook.bind(controller));

export default router;
