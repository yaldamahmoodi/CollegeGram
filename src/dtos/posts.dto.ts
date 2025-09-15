import mongoose from "mongoose";
import {z, ZodString} from "zod";


export const postIdSchema = z.object({
    post_id: z.string()
})
export type postIdSchema = z.infer<typeof postIdSchema>

export const exploreSchema = z.object({
    page: z.number().transform((value) =>
        value < 1 ? 1 : value),
    limit: z.number().transform((value) =>
        value < 10 ? 10 : value),
})