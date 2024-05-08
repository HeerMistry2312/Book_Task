import { Request, Response } from "express";
import { AuthorService } from "../service/author.service";
import { BookInterface } from "../interfaces/book.interface";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
export class authorControl {
    public static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const author = req.id!.toString()
            const data: BookInterface = req.body;
            const book = await AuthorService.CreateBook(author, data)
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


    public static async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const author = req.id!.toString()
            const id = req.params.id;
            const body: BookInterface = req.body;
            const updated = await AuthorService.UpdateBook(author, id, body)
            res.status(200).send(updated)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }

    }


    public static async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const author = req.id!.toString()
            const id = req.params.id;
            const deleted = await AuthorService.DeleteBook(author, id)
            res.status(200).send(deleted)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async showMyBooks(req: Request, res: Response): Promise<void> {
        try {
            const author = req.id!.toString()
            const { page = 1, pageSize = 2 } = req.query;
            const myBooks = await AuthorService.ShowMyBooks(author, +page, +pageSize)

            res.status(200).send(myBooks)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async showBook(req: Request, res: Response): Promise<void> {
        try {
            const name = req.params.name
            const id = req.id!.toString()
            const myBooks = await AuthorService.ShowBook(id, name)
            res.status(200).send(myBooks)
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