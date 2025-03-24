import {createCustomer, getCustomersList, updateCustomerById} from "@/services/customers";
import {initApiLocalization} from "@/lib/localization";
import {validateBody} from "@/lib/validate";
import {createCustomerSchema, updateCustomerSchema} from "@/schemas/customer";
import {StatusCodes} from "http-status-codes";
import {tryCatch} from "@/utils/try-catch";
import {Prisma} from "@prisma/client";
import {PrismaError} from "prisma-error-enum";

export async function GET(request: Request) {
    const {t} = await initApiLocalization(request)

    const {data, error} = await tryCatch(getCustomersList())
    if (error) {
        return Response.json(
            {message: t("general.errors.unexpected")},
            {status: StatusCodes.INTERNAL_SERVER_ERROR}
        )
    }

    return Response.json({data})
}

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
