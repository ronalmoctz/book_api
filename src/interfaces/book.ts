import type { InferInput } from 'valibot';
import { BookSchema, BookCreateSchema, BookUpdateSchema } from '../schemas/book';

export type Book = InferInput<typeof BookSchema>;

export type BookCreate = InferInput<typeof BookCreateSchema>;
export type BookUpdate = InferInput<typeof BookUpdateSchema>;