import {APIError} from "./api.errors.ts";
import type {ErrorCode} from "./catalogue.errors.ts";

export class AlreadyDoneError extends APIError {
    constructor(message: ErrorCode, detail?: string) {
        super(message, 409, detail);
    }
}