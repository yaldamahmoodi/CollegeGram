import {z} from "zod";

export const followSchema = z.object({
    followerUserId: z.string(),
})