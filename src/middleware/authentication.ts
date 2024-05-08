import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { SECRET_KEY } from "../config/config";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
declare module 'express' {
    interface Request {
        id?: Types.ObjectId;
        role?: string;
    }
}

export class authentication {
    public static async authUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let token = req.header("Authorization");
            if (!token) {
                throw new InternalServerError('UnAuthorized');
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new InternalServerError('SECRET_KEY is not defined');
            }
            const decoded = jwt.verify(token, SECRET_KEY) as { id: Types.ObjectId, role: string }
            req.id = decoded.id;
            req.role = decoded.role;
            console.log(decoded)
            next();
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async authAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let token = req.header("Authorization");
            if (!token) {
                throw new InternalServerError('UnAuthorized');
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new InternalServerError('SECRET_KEY is not defined');
            }
            const decoded = jwt.verify(token, SECRET_KEY) as { id: Types.ObjectId, role: string }

            if (!decoded.role || decoded.role !== 'admin') {
                throw new InternalServerError('Forbbiden');
            }
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async authAuthor(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let token = req.header("Authorization");
            if (!token) {
                throw new InternalServerError('UnAuthorized');
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new InternalServerError('SECRET_KEY is not defined');
            }
            const decoded = jwt.verify(token, SECRET_KEY) as { id: Types.ObjectId, role: string }

            if (!decoded.role || decoded.role !== 'author') {
                throw new InternalServerError('Forbbiden');
            }
            req.id = decoded.id;
            req.role = decoded.role;
            next();
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