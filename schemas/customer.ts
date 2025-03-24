import {z} from "zod";

const customerIdSchema = z.object({id: z.string().uuid()})

export const customerSchema = z.object({
    email: z.string(),
    name: z.string()
})

export type CustomerType = z.infer<typeof customerSchema>

export const updateCustomerSchema = customerSchema
    .partial()
    .and(customerIdSchema)

export type UpdateCustomerType = z.infer<typeof updateCustomerSchema>
