import {z} from "zod";

export const followSchema = z.object({
    followerUserId: z.string(),
})

export const acceptFollowRequestSchema = z.object({
    followerUserId: z.string(),
})

export const rejectFollowRequestSchema = z.object({
    followerUserId: z.string(),
})

export const blockUserSchema = z.object({
    blockUserId: z.string(),
})  