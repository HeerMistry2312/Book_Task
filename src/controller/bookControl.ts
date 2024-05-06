
import { Request, Response } from "express";
import { BookService } from "../service/bookService";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';

export class bookControl {
    public static async showBook(req: Request, res: Response): Promise<void> {
        try {
            const name = req.params.name
            const book = await BookService.ShowBook(name)
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
            const book = await BookService.ShowAllBooks()
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
            const book = await BookService.ShowByCategory(category)
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
            const book = await BookService.ShowByAuthor(id)
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