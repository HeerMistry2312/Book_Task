import { Request, Response } from "express";
import { CartService } from "../service/cartService";
import { AuthReq } from "../middleware/authentication";
import Cart from "../model/cartModel";

export class CartControl {
    public static async goToCart(req: Request, res: Response): Promise<void> {
        try {
            const id = (req as AuthReq).id!.toString()
            const cart = await CartService.goToCart(id)
            res.send(cart)
        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const id = (req as AuthReq).id!.toString()
            const { bookName, quantity } = req.body
            const cart = await CartService.addToCart(id, bookName, quantity)
            res.send(cart)

        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async decrementBook(req: Request, res: Response): Promise<void> {
        try {
            const id = (req as AuthReq).id!.toString()
            const { bookName } = req.body
            const cart = await CartService.decrementBook(id, bookName)
            res.send(cart)

        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async removeBook(req: Request, res: Response): Promise<void> {
        try {
            const id = (req as AuthReq).id!.toString()
            const { bookName } = req.body
            const cart = await CartService.removeBook(id, bookName)
            res.send(cart)

        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async emptyCart(req: Request, res: Response): Promise<void> {
        try {
            const id = (req as AuthReq).id!.toString()
            const cart = await CartService.emptyCart(id)
            res.send(cart)

        } catch (error) {
            res.status(500).send(error);
        }
    }


    public static async downloadFile(req: Request, res: Response): Promise<void> {
        try {
            const id = (req as AuthReq).id!.toString()
            const cart = await CartService.downloadFile(id)
            res.send(cart)

        } catch (error) {
            res.status(500).send(error);
        }
    }

}