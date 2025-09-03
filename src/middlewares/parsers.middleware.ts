import {type ZodSchema, ZodError, z} from "zod";
import type {Request, Response, NextFunction} from "express";

export const bodyParser =
    <T extends ZodSchema>(schema: T) => {
        return (
            req: Request<{}, {}, z.infer<T>>,
            res: Response,
            next: NextFunction
        ) => {
            try {
                schema.parse(req.body);
                next()
            } catch (error) {
                if (error instanceof ZodError) {
                    return res.status(400).json({
                        error: error.issues.map((issue) => ({
                            field: issue.path.join('.'),
                            message: issue.message,
                        })),
                    });
                }
                return res.status(500).json({
                        error: "Internal server error",
                    }
                )
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
                    res.status(400).json({
                        error: 'invalid parameters', details: err.issues.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message
                        }))
                    })
                }
            }

        }


