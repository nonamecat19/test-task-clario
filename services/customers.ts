import {db} from "@/lib/db";
import {UUID} from "node:crypto";
import {CustomerType, UpdateCustomerType} from "@/schemas/customer";

interface GetCustomersListOptions {
    page?: number
    perPage?: number
}

export function getCustomersList({page = 0, perPage = 20}: GetCustomersListOptions = {}) {
    return db.customer.findMany({
        take: perPage,
        skip: page ? page * perPage : 0,
        select: {
            id: true,
            name: true,
            email: true
        }
    })
}

export function getCustomerById(id: UUID) {
    return db.customer.findUnique({
        where: {
            id
        }
    })
}

export function updateCustomerById(customer: UpdateCustomerType) {
    const {id, name, email} = customer
    return db.customer.update({
        where: {
            id,
        },
        data: {
            ...(name && {name}),
            ...(email && {email})
        }
    })
}

export function createCustomer(customer: CustomerType) {
    const {email, name} = customer
    return db.customer.create({
        data: {
            email,
            name
        }
    })
}

export function deleteCustomer(id: UUID) {
    return db.customer.delete({
        where: {
            id
        }
    })
}