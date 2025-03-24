const SUPPORTED_LANGS = ["uk", "en"]

export function GET(request: Request) {
    const lang = request.headers.get('accept-language')

    if (!lang || !SUPPORTED_LANGS.includes(lang)) {
        return Response.json({}, {status: 400})
    }

    return Response.json({ lang })
}