import type { InferInput } from 'valibot';
import { PublisherSchema, PublisherCreateSchema, PublisherUpdateSchema } from '../schemas/publisher';

export type Publisher = InferInput<typeof PublisherSchema>;

export type PublisherCreate = InferInput<typeof PublisherCreateSchema>;
export type PublisherUpdate = InferInput<typeof PublisherUpdateSchema>;