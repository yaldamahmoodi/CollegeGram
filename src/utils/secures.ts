import bcrypt from "bcrypt";
import jwt, {type JwtPayload} from "jsonwebtoken";
import env from "../../env.ts";
import {createSecretKey} from "node:crypto";
import {InternalErrors} from "./errors/internal.errors.ts";


export const hashGenerator = async (input: string) => {
    return await bcrypt.hash(input, 10);
}

export const compareHash = async (input: string, hash: string) => {
    return await bcrypt.compare(input, hash);
}

export const generateToken = async (data: JwtPayload): Promise<string> => {
    const secret = env.ACCESS_TOKEN_SECRET
    if (!secret) throw new InternalErrors(
        "INVALID_TOKEN", "ACCESS_TOKEN_SECRET is not defined"
    )

    const token = createSecretKey(secret, "utf-8")
    return jwt.sign({
            ...data
        }, token, {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN || "30m"
        }
    )
}

export const verifyJWTToken = async (token: string): Promise<JwtPayload> => {
    const secret = createSecretKey(env.ACCESS_TOKEN_SECRET, "utf-8")
    return jwt.verify(token, secret) as JwtPayload

}