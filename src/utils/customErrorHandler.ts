import { CustomError } from "../interfaces/customError.interface";
export class AppError extends Error implements CustomError {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}