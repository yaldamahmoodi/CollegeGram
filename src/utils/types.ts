import {z} from "zod";


export const UserParamsSchema = z.object({
    id: z.string(),
    page:z.number().optional(),
    pageSize:z.number().optional(),
})
export type userParamSchema = z.infer<typeof UserParamsSchema>;