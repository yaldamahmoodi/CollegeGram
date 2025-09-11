import mongoose from "mongoose";
import {z} from "zod";


export const postIdSchema = z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId",
    });


export type postIdSchema = z.infer<typeof postIdSchema>