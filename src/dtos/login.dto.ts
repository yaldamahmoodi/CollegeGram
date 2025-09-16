import {z} from "zod";

export const loginDTO = z.object({
    username: z.string().min(5),
    password: z.string().min(8),
});

export type LoginDTO = z.infer<typeof loginDTO>