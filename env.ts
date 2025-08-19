import {env as loadEnv} from 'custom-env';
import {z} from 'zod';

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "development";
const isTest = process.env.APP_STAGE === "test";

if (isDevelopment) {
    loadEnv()
} else if (isTest) {
    loadEnv(".env.test")
}

const envSchema = z.object({
    // CONFIGURATION
    APP_STAGE: z.enum(["development", "production", "test"]),
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().min(3000).max(65535).default(3001),
    CORS_ORIGIN: z.string().startsWith("http://") || z.string().startsWith("https://"),

    // DB
    MONGODB_URI: z.string().startsWith("mongodb://"),
    MIN_POOL_SIZE: z.coerce.number().min(5).max(15).default(5),
    MAX_POOL_SIZE: z.coerce.number().min(15).max(25).default(25),

    // SECURITY
    ACCESS_TOKEN_SECRET: z.string().default("secret"),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
})

export type Env = z.infer<typeof envSchema>;

let env: Env;
try {
    env = envSchema.parse(process.env);
} catch (error) {
    if (error instanceof z.ZodError) {
        console.log("Invalid Environment Variables")
        console.log(JSON.stringify(z.treeifyError(error), null, 2))
        error.issues.forEach(issue => {
            const {path, code, message} = issue;
            console.log(`${path.join(".")}: ${code} - ${message}`)
        })
        process.exit(1);
    }
    throw error;
}

export const isProd = () => env.NODE_ENV === 'production'
export const isDev = () => env.NODE_ENV === 'development'
export const isTestEnv = () => env.NODE_ENV === 'test'

export {env}
export default env