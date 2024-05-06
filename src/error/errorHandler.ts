export class BaseError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class InternalServerError extends BaseError {
    constructor(message: string) {
        super(message, 500);
    }
}

export class BadRequestError extends BaseError {
    constructor(message: string) {
        super(message, 400);
    }
}

// Error handling class
export class ErrorHandler {
    static handleError(error: Error): BaseError {

        console.error(error);
        if (error instanceof InternalServerError) {
            return error;
        } else if (error instanceof BadRequestError) {
            return error;
        } else {
            return new InternalServerError('Internal Server Error');
        }
    }
}


