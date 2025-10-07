import { type ErrorCode} from "./catalogue.errors.ts";
import {APIError} from "./api.errors.ts";

export class UnauthorizedError extends APIError {
    constructor(message: ErrorCode, detail?: string) {
        super(message, 401, detail);
    }
}
