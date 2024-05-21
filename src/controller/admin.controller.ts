import { Request, Response, NextFunction } from "express";
import { AdminService } from "../service/imports";
import { StatusCode } from "../enum/imports";
import { AppError } from "../utils/imports";

export class AdminControl {
  public static async approveAuthor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      let user = await AdminService.approveAuthor(id);
      res.status(StatusCode.OK).send(user);
    } catch (error: any) {
      next(error);
    }
  }

  public static async approveAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id;
      let user = await AdminService.approveAdmin(id);
      res.status(StatusCode.OK).send(user);
    } catch (error: any) {
      next(error);
    }
  }
  public static async listofPendingReq(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = 1, pageSize = 2, searchQuery, sortBy } = req.query;
      const un = await AdminService.listofPendingReq(
        +page,
        +pageSize,
        searchQuery as string,
        sortBy as string
      );
      res.status(StatusCode.OK).send(un);
    } catch (error: any) {
      next(error);
    }
  }


//   public static async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {

//         const {title, author,isbn, categories, description, price } = req.body
//         let book = await AdminService.createBook(title, author, isbn, categories, description, price )
//         res.status(StatusCode.OK).send(book)
//     }  catch (error:any) {
//         next(error)
//      }
// }
}
