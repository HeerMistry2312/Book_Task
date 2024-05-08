import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import { SECRET_KEY } from "../config/config";
import { appError, errorHandlerMiddleware} from "../error/errorHandler";
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
                throw new appError('UnAuthorized',401);
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new appError('SECRET_KEY is not defined',404);
            }
            const decoded = jwt.verify(token, SECRET_KEY) as { id: Types.ObjectId, role: string }
            req.id = decoded.id;
            req.role = decoded.role;
            console.log(decoded)
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
            let token = req.header("Authorization");
            if (!token) {
                throw new appError('UnAuthorized',401);
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new appError('SECRET_KEY is not defined',404);
            }
            const decoded = jwt.verify(token, SECRET_KEY) as { id: Types.ObjectId, role: string }

            if (!decoded.role || decoded.role !== 'admin') {
                throw new appError('Forbbiden',403);
            }
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        } catch (error:any) {
            next(error)
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
                throw new appError('UnAuthorized',401);
            }
            token = token!.replace("Bearer ", "")
            if (!SECRET_KEY) {
                throw new appError('SECRET_KEY is not defined',404);
            }
            const decoded = jwt.verify(token, SECRET_KEY) as { id: Types.ObjectId, role: string }

            if (!decoded.role || decoded.role !== 'author') {
                throw new appError('Forbbiden',403);
            }
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        } catch (error:any) {
            next(error)
         }
    }

}