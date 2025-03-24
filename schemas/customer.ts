import {z} from "zod";

const customerSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string()
})

export const createCustomerSchema = customerSchema.omit({id: true})

export type CreateCustomerType = z.infer<typeof createCustomerSchema>

export const updateCustomerSchema = customerSchema
    .partial()
    .required({id: true})

export type UpdateCustomerType = z.infer<typeof updateCustomerSchema>

export const deleteCustomerSchema = customerSchema.pick({id: true})

export type DeleteCustomerType = z.infer<typeof deleteCustomerSchema>

export const getCustomerByIdSchema = customerSchema.pick({id: true})

export type GetCustomerByIdType = z.infer<typeof getCustomerByIdSchema>