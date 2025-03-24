import {tryCatch} from "@/utils/try-catch";
import {login} from "@/services/auth";
import {validateBody} from "@/lib/validate";
import {authLoginSchema} from "@/schemas/auth";
import {initApiLocalization} from "@/lib/localization";

export async function POST(request: Request) {
    const {t} = await initApiLocalization(request)

    const {data: body, success} = await validateBody(request, authLoginSchema)
    if (!success) {
        return Response.json({message: t("general.errors.invalidBody")})
    }

    const {data: token, error} = await tryCatch(login(body.email, body.password))

    if (error) {
        const message = t(error.cause?.code ?? "general.errors.unexpected")
        return Response.json({message})
    }

    return Response.json({token})
}