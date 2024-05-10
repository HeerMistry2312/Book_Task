import { Request, Response, NextFunction } from "express";
import { AuthorService } from "../service/author.service";
import { BookInterface } from "../interfaces/book.interface";
import StatusCode from "../enum/statusCode";
export class AuthorControl {
    public static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const data: BookInterface = req.body;
            const book = await AuthorService.createBook(author, data)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }

    }


    public static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const id = req.params.id;
            const body: BookInterface = req.body;
            const updated = await AuthorService.updateBook(author, id, body)
            res.status(StatusCode.OK).send(updated)

        }  catch (error:any) {
            next(error)
         }

    }


    public static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const id = req.params.id;
            const deleted = await AuthorService.deleteBook(author, id)
            res.status(StatusCode.OK).send(deleted)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showMyBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const { page = 1, pageSize = 2 } = req.query;
            const myBooks = await AuthorService.showMyBooks(author, +page, +pageSize)

            res.status(StatusCode.OK).send(myBooks)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name
            const id = req.id!.toString()
            const myBooks = await AuthorService.showBook(id, name)
            res.status(StatusCode.OK).send(myBooks)
        }  catch (error:any) {
            next(error)
         }
    }
}