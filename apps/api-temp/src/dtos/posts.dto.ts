import mongoose from "mongoose";
import {z, ZodString} from "zod";


export const postIdSchema = z.object({
    post_id: z.string()
})
export type postIdSchema = z.infer<typeof postIdSchema>

export const exploreSchema = z.object({
    page: z.string().transform((value) =>
        Number(value) < 1 ? 1 : Number(value)),
    pageSize: z.string().transform((value) =>
        Number(value) < 10 ? 10 : Number(value)),
})

export type exploreSchema = z.infer<typeof exploreSchema>