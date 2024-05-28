import { NextFunction, Request, Response } from "express";
import { BookService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import mongoose from "mongoose";
export class BookControl {
  public static async showBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const name = req.params.name;
      const book = await BookService.showBook(name);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(book);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async showAllBooks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const book = await BookService.showAllBooks(
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
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
}
