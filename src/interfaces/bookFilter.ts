import type { InferInput } from "valibot";
import { BookFilterSchema } from "../schemas/bookFilter.js";

export type BookFilter = InferInput<typeof BookFilterSchema>;