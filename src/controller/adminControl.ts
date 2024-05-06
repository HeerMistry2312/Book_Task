import { Request, Response } from "express";
import { AdminService } from "../service/adminService";
import { Types } from "mongoose";
import { AuthReq } from "../middleware/authentication";

export class adminControl {
    public static async approveAuthor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.ApproveAuthor(id)
            res.status(200).send({ message: "Author Approved Status:" })
        } catch (error) {
            res.send({ messgae: error })
        }
    }


    public static async approveAdmin(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.ApproveAdmin(id)
            res.status(200).send({ message: "Admin Approved status:" })
        } catch (error) {
            res.send({ messgae: error })
        }
    }


    public static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const { title, author, categories, description, price } = req.body;
            let book = await AdminService.CreateBook(title, author, categories, description, price)
            res.status(200).send({ message: "Book created Successfully", data: book })
        } catch (error) {
            res.send({ messgae: error })
        }
    }


    public static async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const body = req.body;
            let update = await AdminService.UpdateBook(id, body)
            res.status(200).send(update)
        } catch (error) {
            res.send({ messgae: error })
        }
    }


    public static async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let book = await AdminService.DeleteBook(id)
            res.status(200).send(book)
        } catch (error) {
            res.send({ messgae: error })
        }
    }



}