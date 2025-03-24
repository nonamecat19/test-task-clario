import {initApiLocalization} from "@/lib/localization";
import {validateParamsFromRequest} from "@/lib/validate";
import {deleteCustomerSchema, DeleteCustomerType, getCustomerByIdSchema, GetCustomerByIdType} from "@/schemas/customer";
import {deleteCustomer, getCustomerById} from "@/services/customers";
import {StatusCodes} from "http-status-codes";
import {tryCatch} from "@/utils/try-catch";
import {Prisma} from "@prisma/client";
import {PrismaError} from "prisma-error-enum";

export async function GET(request: Request, {params}: { params: GetCustomerByIdType }) {
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

export async function DELETE(request: Request, {params}: { params: DeleteCustomerType }) {
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
