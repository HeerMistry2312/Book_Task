import { Request, Response , NextFunction} from "express";
import { AdminService } from "../service/admin.service";
import { BookInterface } from "../interfaces/book.interface";
import StatusCode from "../enum/statusCode";
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
            const Data: BookInterface = req.body;
            let book = await AdminService.createBook(Data)
            res.status(StatusCode.OK).send(book)
        }  catch (error:any) {
            next(error)
         }
    }


    public static async updateBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            const body: BookInterface = req.body;
            let update = await AdminService.updateBook(id, body)
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
            const { page = 1, pageSize = 2 } = req.query;
            const un = await AdminService.listofPendingReq(+page, +pageSize)
            res.status(StatusCode.OK).send(un)
        }  catch (error:any) {
            next(error)
         }
    }

}