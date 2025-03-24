import {z} from "zod";

export const authLoginSchema = z.object({
    email: z.string(),
    password: z.string()
})