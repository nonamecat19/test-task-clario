import {initApiLocalization} from "@/lib/localization";

export async function GET(request: Request) {
    const {t} = await initApiLocalization(request)

    return Response.json({message: t("greeting")})
}