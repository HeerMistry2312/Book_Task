import { Request, Response } from "express";
import { cartService } from "../service/cart.service";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
export class cartControl {
    public static async goToCart(req: Request, res: Response): Promise<void> {
        try {
            const id = req.id!.toString()
            const cart = await cartService.goToCart(id)

            res.status(200).send(cart)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const id = req.id!.toString()
            const { bookName, quantity } = req.body
            const cart = await cartService.addToCart(id, bookName, quantity)
            res.status(200).send(cart)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async decrementBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.id!.toString()
            const { bookName } = req.body
            const cart = await cartService.decrementBook(id, bookName)
            res.status(200).send(cart)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async removeBook(req: Request, res: Response): Promise<void> {
        try {
            const id = req.id!.toString()
            const { bookName } = req.body
            const cart = await cartService.removeBook(id, bookName)
            res.status(200).send(cart)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async emptyCart(req: Request, res: Response): Promise<void> {
        try {
            const id = req.id!.toString()
            const cart = await cartService.emptyCart(id)
            res.status(200).send(cart)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async downloadFile(req: Request, res: Response): Promise<void> {
        try {
            const id = req.id!.toString()
            const cart = await cartService.downloadFile(id)
            res.status(200).send(cart)

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