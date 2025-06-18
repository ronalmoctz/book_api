import { number, string, date, maxLength, pipe, object } from "valibot";

export const GenreSchema = object({
    id: number(),
    name: pipe(string(), maxLength(50)),
    created_at: date(),
    updated_at: date()
})


export const CreateGenreSchema = object({
    name: pipe(string(), maxLength(50))
})

export const UpdateGenreSchema = object({
    name: pipe(string(), maxLength(50))
})



