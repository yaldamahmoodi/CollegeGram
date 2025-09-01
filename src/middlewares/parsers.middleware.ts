import {type ZodSchema, ZodError} from "zod";
import type {Request, Response, NextFunction} from "express";
import {ZodValidationError} from "../utils/errors/zod.errors.ts";
import {InternalErrors} from "../utils/errors/internal.errors.ts";


export const bodyParser = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
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


export const paramsParser = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.params)
            next()
        } catch (error) {
            if (error instanceof ZodError) {
               return next(new ZodValidationError(error))
            }
            next(new InternalErrors())
        }
    }
}