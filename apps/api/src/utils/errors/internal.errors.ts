import { type ErrorCode} from "./catalogue.errors.ts";
import {APIError} from "./api.errors.ts";

export class InternalErrors extends APIError {
    constructor(message: ErrorCode = "INTERNAL_SERVER_ERROR", detail?: string) {
        super(message, 500, detail);
    }
}