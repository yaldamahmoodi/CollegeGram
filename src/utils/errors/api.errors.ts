import type {ErrorCode} from "./catalogue.errors.ts";

export class APIError extends Error {
    status: number;
    code: ErrorCode;
    detail?: string;

    constructor(code: ErrorCode, status: number, detail?: string) {
        super(code);
        this.code = code;
        this.status = status;
        this.detail = detail

        Object.setPrototypeOf(this, new.target.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
