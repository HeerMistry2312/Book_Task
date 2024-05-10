
import { Request, Response, NextFunction } from 'express';

import { AppError } from '../utils/customErrorHandler';
import { CustomError } from '../interfaces/customError.interface';


export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let handledError: CustomError = {
        message: 'Internal Server Error',
        statusCode: 500
    };

    if (error instanceof AppError) {
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
