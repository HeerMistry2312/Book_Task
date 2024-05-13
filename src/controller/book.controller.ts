
import { NextFunction, Request, Response } from "express";
import { BookService } from "../service/book.service";
import StatusCode from "../enum/statusCode";
export class BookControl {
    public static async showBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name
            const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
            const book = await BookService.showBook(name, +page, +pageSize, searchQuery as string, sortBy as string)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showAllBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2, searchQuery, sortBy  } = req.query;
            const book = await BookService.showAllBooks(+page, +pageSize, searchQuery as string, sortBy as string)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }

}