import { NextFunction, Request, Response } from "express";
import { CategoryService } from "../service/imports"
import { StatusCode } from "../enum/imports"

export class CategoryControl{
    public static async showCategories(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2, searchQuery = '', sortBy = 'name', sortOrder = 'asc' } = req.query;
            const category = await CategoryService.allCategories(+page, +pageSize, searchQuery as string, sortBy as string,sortOrder as string)
            res.status(StatusCode.OK).send(category)

        } catch (error:any) {
            next(error)
         }
    }

    public static async createCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const { name } = req.body;
            const category = await CategoryService.createCategory(name)
            res.status(StatusCode.OK).send(category)
        } catch (error:any) {
            next(error)
         }
    }


    public static async updateCategory(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const categoryName = req.params.category
            const { name } = req.body;
            const category = await CategoryService.updateCategory(categoryName,name)
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