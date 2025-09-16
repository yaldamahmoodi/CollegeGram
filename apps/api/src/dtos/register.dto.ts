import {z} from "zod";

export const registerDto = z.object({
    username: z.string().min(5),
    password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Password must contain uppercase, lowercase, and number'
    }),
    email: z.string(),
});

export type RegisterDTO = z.infer<typeof registerDto>;