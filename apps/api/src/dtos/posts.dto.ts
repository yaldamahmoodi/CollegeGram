import mongoose from "mongoose";
import {z, ZodString} from "zod";


export const postIdSchema = z.object({
    post_id: z.string()
})
export type postIdSchema = z.infer<typeof postIdSchema>