import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    server: {
        JWT_SECRET: z.string(),
        JWT_EXPIRES_IN: z.string().default("1h"),
        ADMIN_EMAIL: z.string(),
        ADMIN_PASSWORD: z.string()
    },
    runtimeEnv: {
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    }
});