import {tryCatch} from "@/utils/try-catch";
import {login} from "@/services/auth";
import {validateBody} from "@/lib/validate";
import {authLoginSchema} from "@/schemas/auth";
import {initApiLocalization} from "@/lib/localization";
import {StatusCodes} from "http-status-codes";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Logs in a user with email and password credentials
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: securepass
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token for further requests
 *       401:
 *         description: Unauthorized - invalid credentials or request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message describing the issue
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Unexpected error message
 */
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
                {status: StatusCodes.UNAUTHORIZED}
            )
        }

        return Response.json(
            {message: t("general.errors.unexpected")},
            {status: StatusCodes.INTERNAL_SERVER_ERROR}
        )
    }

    return Response.json({token})
}