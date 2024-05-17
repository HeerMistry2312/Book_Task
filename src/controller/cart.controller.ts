import { NextFunction, Request, Response } from "express";
import { CartService } from "../service/imports"
import { StatusCode } from "../enum/imports"
import {cartValidation} from "../validation/imports";
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
            const validatedData = await cartValidation.validateCart(req.body);
            const { bookName, quantity } = validatedData;
            const cart = await CartService.addToCart(id, bookName, quantity)
            res.status(StatusCode.OK).send(cart)

        }catch (error:any) {
            next(error)
         }
    }


    public static async decrementBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const validatedData = await cartValidation.validateDecrementBook(req.body);
            const { bookName } = validatedData;
            const cart = await CartService.decrementBook(id, bookName)
            res.status(StatusCode.OK).send(cart)

        } catch (error:any) {
            next(error)
         }
    }


    public static async removeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.id!.toString()
            const validatedData = await cartValidation.validateDecrementBook(req.body);
            const { bookName } = validatedData;
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
            res.status(StatusCode.OK).download(cart)

        } catch (error:any) {
            next(error)
         }
    }

}