
import { Request, Response, NextFunction } from 'express';

export interface customError {
    message: string;
    statusCode: number;
}

export class appError extends Error implements customError {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let handledError: customError = {
        message: 'Internal Server Error',
        statusCode: 500
    };

    if (error instanceof appError) {
        handledError = {
            message: error.message,
            statusCode: error.statusCode
        };
    }

    res.status(handledError.statusCode).json({
        error: {
            message: handledError.message,
            statusCode: handledError.statusCode
        }
    });
};
