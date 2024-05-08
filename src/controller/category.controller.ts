import { Request, Response } from "express";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
import { categoryService } from "../service/category.service";
export class categoryControl {
    public static async showCategories(req: Request, res: Response): Promise<void> {
        try {
            const { page = 1, pageSize = 2 } = req.query;
            const category = await categoryService.allCategories(+page, +pageSize)
            res.status(200).send(category)

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
            const category = await categoryService.createCategory(name)
            res.status(200).send(category)
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
            const category = await categoryService.updateCategory(name)
            res.status(200).send(category)
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
            const category = await categoryService.deleteCategory(name)
            res.status(200).send(category)
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