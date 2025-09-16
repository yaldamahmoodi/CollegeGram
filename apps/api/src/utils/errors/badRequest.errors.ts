import {APIError} from "./api.errors.ts";
import type {ErrorCode} from "./catalogue.errors.ts";

export class BadRequestErrors extends APIError {
    constructor(message: ErrorCode, detail?: string) {
        super(message, 400, detail);
    }
}