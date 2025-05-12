import { object, optional, string, number, boolean } from "valibot";

export const BookFilterSchema = object({
    title: optional(string()),
    authorId: optional(number()),
    genreId: optional(number()),
    publisherId: optional(number()),
    minPrice: optional(number()),
    maxPrice: optional(number()),
    isBestSeller: optional(boolean()),
    minRating: optional(number()),
    maxRating: optional(number()),
    minDiscount: optional(number()),
    maxDiscount: optional(number()),
    year: optional(number()),
});