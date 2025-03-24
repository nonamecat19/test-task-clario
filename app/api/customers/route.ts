import {createCustomer, getCustomersList, updateCustomerById} from "@/services/customers";
import {initApiLocalization} from "@/lib/localization";
import {validateBody} from "@/lib/validate";
import {createCustomerSchema, updateCustomerSchema} from "@/schemas/customer";
import {StatusCodes} from "http-status-codes";
import {tryCatch} from "@/utils/try-catch";
import {Prisma} from "@prisma/client";
import {PrismaError} from "prisma-error-enum";

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Retrieve a list of customers
 *     description: Fetches a paginated list of customers with their id, name, and email
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Customers
 *     responses:
 *       200:
 *         description: Successfully retrieved list of customers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The customer's unique identifier
 *                       name:
 *                         type: string
 *                         description: The customer's name
 *                       email:
 *                         type: string
 *                         description: The customer's email address
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
export async function GET(request: Request) {
    const {t} = await initApiLocalization(request)

    const {data, error} = await tryCatch(getCustomersList())
    if (error) {
        console.log({error})
        return Response.json(
            {message: t("general.errors.unexpected")},
            {status: StatusCodes.INTERNAL_SERVER_ERROR}
        )
    }

    return Response.json({data})
}

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Creates a new customer record with the provided details
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              required:
 *                - email
 *                - name
 *              properties:
 *                email:
 *                  type: string
 *                  format: email
 *                  description: Customer's email address
 *                name:
 *                  type: string
 *                  description: Customer's full name
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       409:
 *         description: Customer with provided email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
export async function POST(request: Request) {
    const {t} = await initApiLocalization(request)

    const {data: body, success} = await validateBody(request, createCustomerSchema)
    if (!success) {
        return Response.json(
            {message: t("general.errors.invalidBody")},
            {status: StatusCodes.BAD_REQUEST}
        )
    }

    const {data, error} = await tryCatch(createCustomer(body))

    if (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaError.UniqueConstraintViolation) {
            const target = error.meta?.target as string[];
            if (target && target.includes('email')) {
                return Response.json(
                    {message: t("customers.errors.emailExists")},
                    {status: StatusCodes.CONFLICT}
                )
            }
        } else {
            return Response.json(
                {message: t("general.errors.unexpected")},
                {status: StatusCodes.INTERNAL_SERVER_ERROR}
            )
        }
    }

    return Response.json(data, {status: StatusCodes.CREATED})
}

/**
 * @swagger
 * /api/customers:
 *   patch:
 *     summary: Update an existing customer
 *     description: Updates customer information for an existing customer record
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Customers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 description: Customer's unique identifier
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *               name:
 *                 type: string
 *                 description: Customer's full name
 *     responses:
 *       201:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Customer's unique identifier
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Customer's email address
 *                 name:
 *                   type: string
 *                   description: Customer's full name
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer ID not found
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred
 */
export async function PATCH(request: Request) {
    const {t} = await initApiLocalization(request)

    const {data: customer, success} = await validateBody(request, updateCustomerSchema)
    if (!success) {
        return Response.json({message: t("general.errors.invalidBody")})
    }

    const {data, error} = await tryCatch(updateCustomerById(customer))

    if (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaError.UniqueConstraintViolation) {
            const target = error.meta?.target as string[];
            if (target && target.includes('email')) {
                return Response.json(
                    {message: t("customers.errors.emailExists")},
                    {status: StatusCodes.CONFLICT}
                )
            }
        } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaError.RecordsNotFound) {
            return Response.json(
                {message: t("customers.errors.idNotFound")},
                {status: StatusCodes.NOT_FOUND}
            )
        } else {
            return Response.json(
                {message: t("general.errors.unexpected")},
                {status: StatusCodes.INTERNAL_SERVER_ERROR}
            )
        }
    }

    return Response.json(data, {status: StatusCodes.CREATED})
}
