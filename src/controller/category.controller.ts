import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../service/category.service";
import Category from '../model/category.model';
import StatusCode from "../enum/statusCode";
export class CategoryControl {
    public static async showCategories(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const category = await CategoryService.allCategories(+page, +pageSize)
            res.status(StatusCode.OK).send(category)

        } catch (error:any) {
            next(error)
         }
    }

    public static async createCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const name = req.body.name
            const category = await CategoryService.createCategory(name)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }
    }


    public static async updateCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const categoryName = req.params.Category
            const name = req.body.name
            const category = await CategoryService.updateCategory(name,categoryName)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }

    }


    public static async deleteCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const categoryName = req.params.Category
            const name = req.body.name
            const category = await CategoryService.deleteCategory(name,categoryName)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }

    }
}