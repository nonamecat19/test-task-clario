import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

export const env = createEnv({
    server: {
        JWT_SECRET: z.string(),
        JWT_EXPIRES_IN: z.string().default("1h"),
    },
    runtimeEnv: {
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    }
});