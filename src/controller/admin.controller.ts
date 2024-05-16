import { Request, Response , NextFunction} from "express";
import { AdminService } from "../service/imports"
import { StatusCode } from "../enum/imports"
import bookValidation from "../validation/book.validation";

export class AdminControl {
    public static async approveAuthor(req: Request, res: Response,next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.approveAuthor(id)
            res.status(StatusCode.OK).send(user)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async approveAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            let user = await AdminService.approveAdmin(id)
            res.status(StatusCode.OK).send(user)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = await bookValidation.validateBook(req.body);
            const {title, author, categories, description, price } = validatedData
            let book = await AdminService.createBook(title, author, categories, description, price )
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const validatedData = await bookValidation.validateUpdateBook(req.body);
            const {title, author, categories, description, price } = validatedData
            let update = await AdminService.updateBook(id, title, author, categories, description, price )
            res.status(StatusCode.OK).send(update)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async deleteBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            let book = await AdminService.deleteBook(id)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }

    public static async listofPendingReq(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
            const un = await AdminService.listofPendingReq(+page, +pageSize, searchQuery as string, sortBy as string)
            res.status(StatusCode.OK).send(un)
        }  catch (error:any) {
            next(error)
         }
    }

}