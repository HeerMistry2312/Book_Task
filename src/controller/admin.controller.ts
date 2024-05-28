import { Request, Response, NextFunction } from "express";
import { AdminService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import { bookValidation } from "../validation/imports";
import mongoose from "mongoose";

export class AdminControl {
  public static async approveAuthor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.params.id;
      let user = await AdminService.approveAuthor(id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(user);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async approveAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.params.id;
      let user = await AdminService.approveAdmin(id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(user);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async createBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const validatedData = await bookValidation.validateBook(req.body);
      const { title, author, categories, description, price } = validatedData;
      let book = await AdminService.createBook(
        title,
        author,
        categories,
        description,
        price
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(book);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async updateBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.params.id;
      const validatedData = await bookValidation.validateUpdateBook(req.body);
      const { title, author, categories, description, price } = validatedData;
      let update = await AdminService.updateBook(
        id,
        title,
        author,
        categories,
        description,
        price
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(update);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async deleteBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const id = req.params.id;
      let book = await AdminService.deleteBook(id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(book);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async listofPendingReq(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const pending = await AdminService.listofPendingReq(
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(pending);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
