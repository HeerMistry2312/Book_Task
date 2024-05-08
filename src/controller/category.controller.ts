import { Request, Response } from "express";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
import { CategoryService } from "../service/category.service";
export class categoryControl {
    public static async showCategories(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const cat = await CategoryService.AllCategories(+page, +pageSize)
            res.status(200).send(cat)

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }

    public static async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const name = req.body.name
            const cat = await CategoryService.createCategory(name)
            res.status(200).send(cat)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const name = req.body.name
            const cat = await CategoryService.updateCategory(name)
            res.status(200).send(cat)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }

    }


    public static async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const name = req.body.name
            const cat = await CategoryService.deleteCategory(name)
            res.status(200).send(cat)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }

    }
}