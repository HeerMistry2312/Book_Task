
import { Request, Response } from "express";
import { bookService } from "../service/book.service";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
export class bookControl {
    public static async showBook(req: Request, res: Response): Promise<void> {
        try {
            const name = req.params.name
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showBook(name, +page, +pageSize)
            res.status(200).send(book)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async showAllBooks(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showAllBooks(+page, +pageSize)
            res.status(200).send(book)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async showByCategory(req: Request, res: Response): Promise<void> {
        try {
            const category = req.params.cat;
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showByCategory(category, +page, +pageSize)
            res.status(200).send(book)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async showByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.author
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showByAuthor(id, +page, +pageSize)

            res.status(200).send(book)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }
}