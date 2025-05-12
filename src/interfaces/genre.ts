import type { InferInput } from 'valibot';
import { GenreSchema, CreateGenreSchema, UpdateGenreSchema } from '../schemas/genre';

export type Genre = InferInput<typeof GenreSchema>;
export type GenreCreateInput = InferInput<typeof CreateGenreSchema>
export type GenreUpdateInput = InferInput<typeof UpdateGenreSchema>