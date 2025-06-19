import type { InferInput } from 'valibot';
import { AuthorSchema, AuthorCreateSchema, AuthorUpdateSchema } from '../schemas/author.js';


export type Author = InferInput<typeof AuthorSchema>;
export type AuthorCreateInput = InferInput<typeof AuthorCreateSchema>
export type AuthorUpdateInput = InferInput<typeof AuthorUpdateSchema>