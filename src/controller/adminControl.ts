import { Request, Response } from "express";
import { AdminService } from "../service/adminService";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
export class adminControl {
    public static async approveAuthor(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.ApproveAuthor(id)
            res.status(200).send(user)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async approveAdmin(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.ApproveAdmin(id)
            res.status(200).send(user)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const { title, author, categories, description, price } = req.body;
            let book = await AdminService.CreateBook(title, author, categories, description, price)
            res.status(200).send({ message: "Book created Successfully", data: book })
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
            const id = req.params.id;
            const body = req.body;
            let update = await AdminService.UpdateBook(id, body)
            res.status(200).send(update)
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
            const id = req.params.id
            let book = await AdminService.DeleteBook(id)
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

    public static async listofPendingReq(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const un = await AdminService.listofPendingReq(+page, +pageSize)
            res.status(200).send(un)
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