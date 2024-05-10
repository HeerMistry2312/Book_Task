import { NextFunction, Request, Response } from "express";
import { CartService } from "../service/cart.service";
import StatusCode from "../enum/statusCode";
export class CartControl {
    public static async goToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const cart = await CartService.goToCart(id)

            res.status(StatusCode.OK).send(cart)

        } catch (error:any) {
            next(error)
         }
    }


    public static async addToCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const { bookName, quantity } = req.body
            const cart = await CartService.addToCart(id, bookName, quantity)
            res.status(StatusCode.OK).send(cart)

        }catch (error:any) {
            next(error)
         }
    }


    public static async decrementBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const { bookName } = req.body
            const cart = await CartService.decrementBook(id, bookName)
            res.status(StatusCode.OK).send(cart)

        } catch (error:any) {
            next(error)
         }
    }


    public static async removeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const { bookName } = req.body
            const cart = await CartService.removeBook(id, bookName)
            res.status(StatusCode.OK).send(cart)

        } catch (error:any) {
            next(error)
         }
    }


    public static async emptyCart(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const cart = await CartService.emptyCart(id)
            res.status(StatusCode.OK).send(cart)

        }catch (error:any) {
            next(error)
         }
    }


    public static async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const cart = await CartService.downloadFile(id)
            res.status(StatusCode.OK).send(cart)

        } catch (error:any) {
            next(error)
         }
    }

}