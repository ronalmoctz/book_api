import { object, optional, string, number, pipe, date, email, maxLength, nullable } from 'valibot';

export const PublisherSchema = object({
    id: number(),
    name: pipe(string(), maxLength(100)),
    address: nullable(pipe(string(), maxLength(200))),
    phone: nullable(pipe(string(), maxLength(20))),
    email: nullable(pipe(string(), maxLength(100), email())),
    create_at: date(),
    update_at: date()
});

export const PublisherCreateSchema = object({
    name: pipe(string(), maxLength(100)),
    address: pipe(string(), maxLength(200)),
    phone: pipe(string(), maxLength(20)),
    email: pipe(string(), maxLength(100), email()),
});

export const PublisherUpdateSchema = object({
    name: optional(pipe(string(), maxLength(100))),
    address: optional(nullable(string())),
    phone: optional(nullable(pipe(string(), maxLength(20)))),
    email: optional(nullable(pipe(string(), maxLength(100), email()))),
});
