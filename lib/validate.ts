import {ZodSchema} from "zod";

type Success<T> = { success: true; data: T }
type Failure = { success: false; data: null }

export async function validateBody<T>(
    req: Request,
    schema: ZodSchema<T>
): Promise<Success<T> | Failure> {
    try {
        const json = await req.json()
        const parsed = schema.parse(json)
        return {
            success: true,
            data: parsed
        }
    } catch {
        return {
            success: false,
            data: null
        };
    }
}

export async function validateParamsFromRequest<T>(
    params: Record<string, unknown>,
    schema: ZodSchema<T>
): Promise<Success<T> | Failure> {
    try {
        const parsed = schema.parse(params);
        return {
            success: true,
            data: parsed
        };
    } catch {
        return {
            success: false,
            data: null
        };
    }
}