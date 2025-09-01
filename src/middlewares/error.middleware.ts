import type {Request, Response, NextFunction} from 'express';
import {APIError} from "../utils/errors/api.errors.ts";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof APIError) {
        return res.status(err.status).json({
            status: err.status,
            code: err.code,
            error: err.message,
        });
    }

    return res.status(500).json({
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        error: "Something went wrong",
        ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
    });
};


export {errorHandler}
export default errorHandler;
