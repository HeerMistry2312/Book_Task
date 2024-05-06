import { Request, Response } from "express";
import { AuthorService } from "../service/authorService";
import { Types } from "mongoose";
import { AuthReq } from "../middleware/authentication";


export class authorControl {
    public static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const author = (req as AuthReq).id!.toString()
            const { title, categories, description, price } = req.body;
            const book = await AuthorService.CreateBook(title, author, categories, description, price)
            res.send(book)
        } catch (error) {
            res.status(500).send(error);
        }

    }


    public static async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const author = (req as AuthReq).id!.toString()
            const id = req.params.id;
            const body = req.body;
            const updated = await AuthorService.UpdateBook(author, id, body)
            res.send(updated)

        } catch (error) {
            res.status(500).send(error);
        }

    }


    public static async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const author = (req as AuthReq).id!.toString()
            const id = req.params.id;
            const deleted = await AuthorService.DeleteBook(author, id)
            res.send(deleted)
        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async showMyBooks(req: Request, res: Response): Promise<void> {
        try {
            const author = (req as AuthReq).id!.toString()
            const myBooks = await AuthorService.ShowMyBooks(author)
            res.send(myBooks)
        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async showBook(req: Request, res: Response): Promise<void> {
        try {
            const name = req.params.name
            const id = (req as AuthReq).id!.toString()
            const myBooks = await AuthorService.ShowBook(id, name)
            res.send(myBooks)
        } catch (error) {
            res.status(500).send(error);
        }
    }
}