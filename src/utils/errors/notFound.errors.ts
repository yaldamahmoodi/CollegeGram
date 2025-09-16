import type {ErrorCode} from "./catalogue.errors.ts";
import {APIError} from "./api.errors.ts";

export class NotFoundError extends APIError {
    constructor(message: ErrorCode, detail?: string) {
        super(message, 404, detail);
    }
}
