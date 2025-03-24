import {initApiLocalization} from "@/lib/localization";
import {validateParamsFromRequest} from "@/lib/validate";
import {deleteCustomerSchema, DeleteCustomerType, getCustomerByIdSchema, GetCustomerByIdType} from "@/schemas/customer";
import {deleteCustomer, getCustomerById} from "@/services/customers";
import {StatusCodes} from "http-status-codes";
import {tryCatch} from "@/utils/try-catch";
import {Prisma} from "@prisma/client";
import {PrismaError} from "prisma-error-enum";

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     description: Returns a single customer based on the provided ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Customer successfully retrieved
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
 *         description: Invalid parameters provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid parameters"
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unexpected error occurred"
 */
export async function GET(request: Request, {params}: { params: Promise<GetCustomerByIdType> }) {
    const {t} = await initApiLocalization(request)

    const {data: paramsData, success} = await validateParamsFromRequest(await params, getCustomerByIdSchema)
    if (!success) {
        return Response.json(
            {message: t("general.errors.invalidParams")},
            {status: StatusCodes.BAD_REQUEST}
        )
    }

    const {data: customer, error} = await tryCatch(getCustomerById(paramsData))

    if (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaError.RecordsNotFound) {
            return Response.json(
                {message: t("customers.errors.idNotFound")},
                {status: StatusCodes.NOT_FOUND}
            )
        }
        return Response.json(
            {message: t("general.errors.unexpected")},
            {status: StatusCodes.INTERNAL_SERVER_ERROR}
        )
    }

    return Response.json(customer)

}

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     description: Deletes a customer from the database based on the provided ID
 *     security:
 *       - BearerAuth: []
 *     tags:
 *       - Customers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the customer to delete
 *     responses:
 *       204:
 *         description: Customer successfully deleted
 *       400:
 *         description: Invalid parameters provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid parameters"
 *       404:
 *         description: Customer with the specified ID was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Customer ID not found"
 *       500:
 *         description: An unexpected error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

export async function DELETE(request: Request, {params}: { params: Promise<DeleteCustomerType> }) {
    const {t} = await initApiLocalization(request)

    const {data: paramsData, success} = await validateParamsFromRequest(await params, deleteCustomerSchema)
    if (!success) {
        return Response.json(
            {message: t("general.errors.invalidParams")},
            {status: StatusCodes.BAD_REQUEST}
        )
    }

    const {error} = await tryCatch(deleteCustomer(paramsData))

    if (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PrismaError.RecordsNotFound) {
            return Response.json(
                {message: t("customers.errors.idNotFound")},
                {status: StatusCodes.NOT_FOUND}
            )
        }

        return Response.json(
            {message: t("general.errors.unexpected")},
            {status: StatusCodes.INTERNAL_SERVER_ERROR}
        )
    }

    return new Response(null, {
        status: StatusCodes.NO_CONTENT
    })
}
