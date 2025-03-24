import {NextResponse} from 'next/server';
import {jwtVerify} from 'jose';
import {StatusCodes} from "http-status-codes";
import {env} from "@/lib/env";

export async function middleware(request: Request) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json(
            {message: 'Authentication required'},
            {status: StatusCodes.UNAUTHORIZED}
        )
    }

    const token = authHeader.split(' ')[1]

    try {
        const secretKey = new TextEncoder().encode(env.JWT_SECRET)
        await jwtVerify(token, secretKey)

        return NextResponse.next();
    } catch {
        return Response.json(
            {message: 'Invalid or expired token'},
            {status: StatusCodes.UNAUTHORIZED}
        )
    }
}

export const config = {
    matcher: ['/api/customers/:path*', '/api/greet/:path*'],
};