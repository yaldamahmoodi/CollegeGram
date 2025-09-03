import {z} from "zod";


export const UserParamsSchema = z.object({
    id: z.string(),
})
export type userParamSchema = z.infer<typeof UserParamsSchema>;