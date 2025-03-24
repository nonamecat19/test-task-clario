import {initApiLocalization} from "@/lib/localization";

/**
 * @swagger
 * /api/greet:
 *   get:
 *     summary: Get a greeting message
 *     description: Returns a localized greeting message
 *     tags:
 *       - Greetings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully returned a greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Localized greeting message
 *                   example: "Hello, user!"
 */
export async function GET(request: Request) {
    const {t} = await initApiLocalization(request)

    return Response.json({message: t("greeting")})
}