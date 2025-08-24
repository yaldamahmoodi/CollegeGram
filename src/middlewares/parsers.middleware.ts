import {type ZodSchema, ZodError} from "zod";
import type {Request, Response, NextFunction} from "express";

export const bodyParser = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    error: error.message,
                })
            }
            return res.status(500).json({
                    error: "Internal server error",
                }
            )
        }

    }
}