import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {env} from "@/lib/env";
import {StringValue} from "ms";

export async function login(email: string, password: string) {
    if (email !== env.ADMIN_EMAIL) {
        throw new Error("Invalid email", {cause: {code: "auth.errors.invalidEmail"}})
    }

    const isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD!);
    if (!isPasswordValid) {
        throw new Error("Invalid password", {cause: {code: "auth.errors.invalidPassword"}})
    }

    return jwt.sign(
        {email},
        env.JWT_SECRET,
        {expiresIn: env.JWT_EXPIRES_IN as StringValue},
    );
}
