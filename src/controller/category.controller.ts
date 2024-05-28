import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import { categoryValidation } from "../validation/imports";
import mongoose from "mongoose";
export class CategoryControl {
  public static async showCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const category = await CategoryService.allCategories(
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );
      await session.commitTransaction();
      res.status(StatusCode.OK).send(category);
      await session.endSession();
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async createCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const validatedData = await categoryValidation.validateCategory(req.body);
      const { name } = validatedData;
      const category = await CategoryService.createCategory(name);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(category);
      await session.endSession();
    } catch (error: any) {
        await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  public static async updateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const categoryName = req.params.category;
      const validatedData = await categoryValidation.validateCategory(req.body);
      const { name } = validatedData;
      const category = await CategoryService.updateCategory(name, categoryName);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(category);
      await session.endSession();
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
      next(error);
    }
  }

  public static async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
      const categoryName = req.params.category;
      const category = await CategoryService.deleteCategory(categoryName);
      await session.commitTransaction();
      res.status(StatusCode.OK).send(category);
      await session.endSession();
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
      next(error);
    }
  }
}
