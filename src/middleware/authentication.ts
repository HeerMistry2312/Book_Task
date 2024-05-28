import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../interfaces/imports';
import { SECRET_KEY } from "../config/imports";
import { AppError } from '../utils/imports';
import '../types/expressExtension'
import { Role } from '../enum/imports';
import StatusConstants from '../constant/status.constant';
export class Authentication {
    public static async authUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            let token = req.header("Authorization");
            if (!token) {
                throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
            }
            const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        } catch (error:any) {
           next(error)
        }
    }


    public static async authAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (req.role !== Role.Admin) {
                throw new AppError(StatusConstants.FORBIDDEN.body.message,StatusConstants.FORBIDDEN.httpStatusCode);
            }
            next();
        } catch (error: any) {
            next(error);
        }
    }


    public static async authAuthor(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (req.role !== Role.Author) {
                throw new AppError(StatusConstants.FORBIDDEN.body.message,StatusConstants.FORBIDDEN.httpStatusCode);
            }
            next();
        } catch (error: any) {
            next(error);
        }
    }

}