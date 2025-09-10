import type {ZodError} from "zod";
import {ValidationError} from "./validation.errors.ts";


export class ZodValidationError extends ValidationError {
  
  
    constructor(zodError: ZodError) {
         
        super("INVALID_CREDENTIALS",zodError.issues.map(e => ({
            path: e.path.join("."),
            message: e.message,
        })))
  
        Object.setPrototypeOf(this, new.target.prototype);
    }
}