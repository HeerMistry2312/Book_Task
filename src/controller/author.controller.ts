import { Request, Response, NextFunction } from "express";
import { AuthorService } from "../service/imports"
import { StatusCode } from "../enum/imports"
export class AuthorControl {
    public static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!
            const {title,isbn, categories, description, price } = req.body
            const book = await AuthorService.createBook(author, title,isbn, categories, description, price)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            console.log(error)
            next(error)
         }

    }


    public static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!
            const id = req.params.id;
            const {title,isbn, categories, description, price } = req.body
            const updated = await AuthorService.updateBook(author, id, title, isbn,categories, description, price)
            res.status(StatusCode.OK).send(updated)

        }  catch (error:any) {
            next(error)
         }

    }


    public static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!
            const id = req.params.id;
            const deleted = await AuthorService.deleteBook(author, id)
            res.status(StatusCode.OK).send(deleted)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showMyBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const author = req.id!
            const { page = 1, pageSize = 2, searchQuery = '', sortBy = 'Bookname', sortOrder = 'asc' } = req.query;
            const myBooks = await AuthorService.showMyBooks(author, +page, +pageSize, searchQuery as string, sortBy as string, sortOrder as string)

            res.status(StatusCode.OK).send(myBooks)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async showBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const name = req.params.name
            const id = req.id!
            const myBooks = await AuthorService.showBook(id, name)
            res.status(StatusCode.OK).send(myBooks)
        }  catch (error:any) {
            next(error)
         }
    }
}