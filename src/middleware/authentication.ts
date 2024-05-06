import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from "mongoose";

export interface AuthReq extends Request {
    id?: Types.ObjectId,
    role?: string
}

export class Authentication {
    public static async authUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            let token = req.header("Authorization");
            if (!token) {
                res.status(401).send({ message: "UnAuthorized" });
                return;
            }
            token = token!.replace("Bearer ", "")
            const decoded = jwt.verify(token, "HeerMistry") as { id: Types.ObjectId, role: string }
            (req as AuthReq).id = decoded.id;
            (req as AuthReq).role = decoded.role;
            console.log(decoded)
            next();
        } catch (error) {
            res.send({ messgae: error })
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
                res.status(401).send({ message: "UnAuthorized" });
                return;
            }
            token = token!.replace("Bearer ", "")
            const decoded = jwt.verify(token, "HeerMistry") as { id: Types.ObjectId, role: string }

            if (!decoded.role || decoded.role !== 'admin') {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            (req as AuthReq).id = decoded.id;
            (req as AuthReq).role = decoded.role;
            next();
        } catch (error) {
            res.send({ messgae: error })
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
                res.status(401).send({ message: "UnAuthorized" });
                return;
            }
            token = token!.replace("Bearer ", "")
            const decoded = jwt.verify(token, "HeerMistry") as { id: Types.ObjectId, role: string }

            if (!decoded.role || decoded.role !== 'author') {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            (req as AuthReq).id = decoded.id;
            (req as AuthReq).role = decoded.role;
            next();
        } catch (error) {
            res.send({ messgae: error })
        }
    }

}