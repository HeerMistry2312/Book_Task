import { Request, Response } from "express";
import { AuthorService } from "../service/authorService";
import { AuthReq } from "../middleware/authentication";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
import { paginate } from "./pagination";
export class authorControl {
    public static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const author = (req as AuthReq).id!.toString()
            const { title, categories, description, price } = req.body;
            const book = await AuthorService.CreateBook(title, author, categories, description, price)
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
            const author = (req as AuthReq).id!.toString()
            const id = req.params.id;
            const body = req.body;
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
            const author = (req as AuthReq).id!.toString()
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
            const author = (req as AuthReq).id!.toString()
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const myBooks = await AuthorService.ShowMyBooks(author)
            const data = [myBooks]
            const paginatedBooks = paginate(data, page, limit);
            res.status(200).send(paginatedBooks)
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
            const id = (req as AuthReq).id!.toString()
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