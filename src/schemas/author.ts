import { object, string, number, optional, pipe, date, maxLength, minLength, transform } from 'valibot';

export const AuthorSchema = object({
    id: number(),
    name: pipe(string(), minLength(1), maxLength(100)),
    last_name: pipe(string(), minLength(1), maxLength(100)),
    bio: optional(string()),
    birth_date: optional(date()),
    create_at: date(),
    update_at: date()
});

export const AuthorCreateSchema = object({
    name: optional(pipe(string(), minLength(1), maxLength(100))),
    last_name: optional(pipe(string(), minLength(1), maxLength(100))),
    bio: optional(string()),
    birth_date: optional(pipe(
        string(),
        transform((val) => new Date(val))
    ))
});

export const AuthorUpdateSchema = object({
    name: optional(pipe(string(), minLength(1), maxLength(100))),
    last_name: optional(pipe(string(), minLength(1), maxLength(100))),
    bio: optional(string()),
    birth_date: optional(date())
});