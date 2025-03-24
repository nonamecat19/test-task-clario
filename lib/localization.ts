import fs from "node:fs/promises";

const FALLBACK_LANG = "en"

export async function initApiLocalization(request: Request) {
    const currentLocale = request.headers.get("accept-language") || FALLBACK_LANG
    return initLocalization(currentLocale)
}

export async function initLocalization(locale: string) {
    let currentLocale = locale

    const acceptedLangs = await fs.readdir('./public/locales')
    if (!acceptedLangs.includes(`${currentLocale}.json`)) {
        currentLocale = FALLBACK_LANG
    }

    const file = await fs.readFile(`./public/locales/${currentLocale}.json`, 'utf-8')
    const jsonData = JSON.parse(file)

    return {
        lang() {
            return currentLocale
        },
        t(key: string) {
            return jsonData[key]
        }
    }
}