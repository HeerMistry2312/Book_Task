import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../service/category.service";
import Category from '../model/category.model';
import StatusCode from "../enum/statusCode";
import categoryValidation from "../validation/category.validation";
export class CategoryControl {
    public static async showCategories(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
            const category = await CategoryService.allCategories(+page, +pageSize, searchQuery as string, sortBy as string)
            res.status(StatusCode.OK).send(category)

        } catch (error:any) {
            next(error)
         }
    }

    public static async createCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const validatedData = await categoryValidation.validateCategory(req.body);
            const { name } = validatedData;
            const category = await CategoryService.createCategory(name)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }
    }


    public static async updateCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const categoryName = req.params.category
            const validatedData = await categoryValidation.validateCategory(req.body);
            const { name } = validatedData;
            const category = await CategoryService.updateCategory(name,categoryName)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }

    }


    public static async deleteCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const categoryName = req.params.category
            const category = await CategoryService.deleteCategory(categoryName)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }

    }
}