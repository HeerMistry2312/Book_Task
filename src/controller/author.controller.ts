import { Request, Response, NextFunction } from "express";
import { AuthorService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import { bookValidation } from "../validation/imports";
import mongoose from "mongoose";
export class AuthorControl {
  public static async createBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const author = req.id!.toString();
      const validatedData = await bookValidation.validateAuthorBook(req.body);
      const { title, categories, description, price } = validatedData;
      const book = await AuthorService.createBook(
        author,
        title,
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
      const author = req.id!.toString();
      const id = req.params.id;
      const validatedData = await bookValidation.validateUpdateAuthorBook(
        req.body
      );
      const { title, categories, description, price } = validatedData;
      const updated = await AuthorService.updateBook(
        author,
        id,
        title,
        categories,
        description,
        price
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(updated);
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
      const author = req.id!.toString();
      const id = req.params.id;
      const deleted = await AuthorService.deleteBook(author, id);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(deleted);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async showMyBooks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const author = req.id!.toString();
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const myBooks = await AuthorService.showMyBooks(
        author,
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );

      await session.commitTransaction();
      res.status(StatusCode.OK).send(myBooks);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async showBook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const name = req.params.name;
      const id = req.id!.toString();
      const myBooks = await AuthorService.showBook(id, name);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(myBooks);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}
