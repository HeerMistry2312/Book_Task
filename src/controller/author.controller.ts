import { Request, Response, NextFunction } from "express";
import { authorService } from "../service/author.service";
import { BookInterface } from "../interfaces/book.interface";
export class authorControl {
    public static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const data: BookInterface = req.body;
            const book = await authorService.createBook(author, data)
            res.status(200).send(book)
        }  catch (error:any) {
            next(error)
         }

    }


    public static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const id = req.params.id;
            const body: BookInterface = req.body;
            const updated = await authorService.updateBook(author, id, body)
            res.status(200).send(updated)

        }  catch (error:any) {
            next(error)
         }

    }


    public static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const id = req.params.id;
            const deleted = await authorService.deleteBook(author, id)
            res.status(200).send(deleted)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showMyBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!.toString()
            const { page = 1, pageSize = 2 } = req.query;
            const myBooks = await authorService.showMyBooks(author, +page, +pageSize)

            res.status(200).send(myBooks)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name
            const id = req.id!.toString()
            const myBooks = await authorService.showBook(id, name)
            res.status(200).send(myBooks)
        }  catch (error:any) {
            next(error)
         }
    }
}