
import { NextFunction, Request, Response } from "express";
import { BookService } from "../service/book.service";
import StatusCode from "../enum/statusCode";
export class BookControl {
    public static async showBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name
            const { page = 1, pageSize = 2 } = req.query;
            const book = await BookService.showBook(name, +page, +pageSize)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const book = await BookService.showAllBooks(+page, +pageSize)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category = req.params.cat;
            const { page = 1, pageSize = 2 } = req.query;
            const book = await BookService.showByCategory(category, +page, +pageSize)
            res.status(StatusCode.OK).send(book)

        }  catch (error:any) {
            next(error)
         }
    }


    public static async showByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.author
            const { page = 1, pageSize = 2 } = req.query;
            const book = await BookService.showByAuthor(id, +page, +pageSize)

            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }
}