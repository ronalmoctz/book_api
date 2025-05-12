import type { InferInput } from "valibot";
import { BookFilterSchema } from "../schemas/bookFilter";

export type BookFilter = InferInput<typeof BookFilterSchema>;