import { NextFunction, Request, Response } from "express";
import { CartService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import { cartValidation } from "../validation/imports";
import mongoose from "mongoose";
export class CartControl {
  public static async goToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!.toString();
      const cart = await CartService.goToCart(id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(cart);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async addToCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!.toString();
      const validatedData = await cartValidation.validateCart(req.body);
      const { bookName, quantity } = validatedData;
      const cart = await CartService.addToCart(id, bookName, quantity);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(cart);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async decrementBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!.toString();
      const validatedData = await cartValidation.validateDecrementBook(
        req.body
      );
      const { bookName } = validatedData;
      const cart = await CartService.decrementBook(id, bookName);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(cart);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async removeBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!.toString();
      const validatedData = await cartValidation.validateDecrementBook(
        req.body
      );
      const { bookName } = validatedData;
      const cart = await CartService.removeBook(id, bookName);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(cart);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async emptyCart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!.toString();
      const cart = await CartService.emptyCart(id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(cart);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async downloadFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.id!.toString();
      const cart = await CartService.downloadFile(id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(cart);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
