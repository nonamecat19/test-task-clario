import {tryCatch} from "@/utils/try-catch";
import {login} from "@/services/auth";
import {validateBody} from "@/lib/validate";
import {authLoginSchema} from "@/schemas/auth";
import {initApiLocalization} from "@/lib/localization";
import {StatusCodes} from "http-status-codes";

export async function POST(request: Request) {
    const {t} = await initApiLocalization(request)

    const {data: body, success} = await validateBody(request, authLoginSchema)
    if (!success) {
        return Response.json(
            {message: t("general.errors.invalidBody")},
            {status: StatusCodes.BAD_REQUEST}
        )
    }

    const {data: token, error} = await tryCatch(login(body.email, body.password))

    if (error) {
        const message = t(error?.cause?.code)
        if (message) {
            return Response.json(
                {message},
                {status: StatusCodes.BAD_REQUEST}
            )
        }

        return Response.json(
            {message: t("general.errors.unexpected")},
            {status: StatusCodes.INTERNAL_SERVER_ERROR}
        )
    }

    return Response.json({token})
}