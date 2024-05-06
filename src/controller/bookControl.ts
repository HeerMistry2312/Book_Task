
import { Request, Response } from "express";
import { BookService } from "../service/bookService";


export class bookControl {
    public static async showBook(req: Request, res: Response): Promise<void> {
        try {
            const name = req.params.name
            const book = await BookService.ShowBook(name)
            res.send(book)
        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async showAllBooks(req: Request, res: Response): Promise<void> {
        try {
            const book = await BookService.ShowAllBooks()
            res.send(book)
        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async showByCategory(req: Request, res: Response): Promise<void> {
        try {
            const category = req.params.cat;
            const book = await BookService.ShowByCategory(category)
            res.send(book)

        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async showByAuthor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.author
            const book = await BookService.ShowByAuthor(id)
            res.send(book)
        } catch (error) {
            res.status(500).send(error);
        }
    }
}