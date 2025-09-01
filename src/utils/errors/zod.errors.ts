import type {ZodError} from "zod";
import {ValidationError} from "./validation.errors.ts";


export class ZodValidationError extends ValidationError {
    details: { path: string; message: string }[];

    constructor(zodError: ZodError) {
        const messages = zodError.issues
            .map(e => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
        super("INVALID_CREDENTIALS");
        this.message = messages;
        this.details = zodError.issues.map(e => ({
            path: e.path.join("."),
            message: e.message,
        }));
        Object.setPrototypeOf(this, new.target.prototype);
    }
}