import type {Request, Response, NextFunction} from 'express';
import {APIError} from "../utils/errors/api.errors.ts";


const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof APIError) {
        return res.status(err.status).json({
            code: err.code,
            details: err.details ||  null,
        });
    }

    return res.status(500).json({
        code: "INTERNAL_SERVER_ERROR",
        detail: "Something went wrong",
        ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
    });
};


export {errorHandler}
export default errorHandler;
