import {type ZodSchema, ZodError, z} from "zod";
import type {Request, Response, NextFunction} from "express";
import {ZodValidationError} from "../utils/errors/zod.errors.ts";
import {InternalErrors} from "../utils/errors/internal.errors.ts";

export const bodyParser =
    <T extends ZodSchema>(schema: T) => {
        return (
            req: Request<{}, {}, z.infer<T>>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                req.body = schema.parse(req.body);
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    return next(new ZodValidationError(error))
                }
                next(new InternalErrors())
            }
        }
    }

export const paramParser =
    <T extends ZodSchema>(schema: T) =>
        (
            req: Request<z.infer<T>, {}, {}>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                schema.parse(req.params)
                next()
            } catch (err) {
                if (err instanceof ZodError) {
                    return next(new ZodValidationError(err))
                }
                next(new InternalErrors())
            }

        }


