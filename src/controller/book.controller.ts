
import { NextFunction, Request, Response } from "express";
import { bookService } from "../service/book.service";
export class bookControl {
    public static async showBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showBook(name, +page, +pageSize)
            res.status(200).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showAllBooks(+page, +pageSize)
            res.status(200).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const category = req.params.cat;
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showByCategory(category, +page, +pageSize)
            res.status(200).send(book)

        }  catch (error:any) {
            next(error)
         }
    }


    public static async showByAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.author
            const { page = 1, pageSize = 2 } = req.query;
            const book = await bookService.showByAuthor(id, +page, +pageSize)

            res.status(200).send(book)
        }  catch (error:any) {
            next(error)
         }
    }
}