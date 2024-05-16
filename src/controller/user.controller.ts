import { Request, Response, NextFunction } from 'express';
import { Types } from "mongoose";
import { UserService } from "../service/imports"
import { StatusCode } from "../enum/imports"
import {AppError} from "../utils/imports"
import UserValidation from '../validation/user.validation';
export class UserControl {


    public static async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = await UserValidation.validateUser(req.body);
            const { username, password, email, role} = validatedData
            let newUser = await UserService.signUp(username, password, email, role)

            res.status(StatusCode.OK).send(newUser)
        } catch (error:any) {
            next(error)
         }
    }


    public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData = await UserValidation.validateLogin(req.body);
            const { username, password } = validatedData;
            let user = await UserService.login(username, password)
            const sessionUser = req.session as unknown as { user: any }
            if (user) {
                sessionUser.user = user
                res.status(StatusCode.OK).send(user);
            } else {
                throw new AppError('Incorrect Credentials',401);
            }
        }catch (error:any) {
            next(error)
         }
    }

    public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = req.id
            await UserService.logout(id);
            req.session.destroy((err) => {
                if (err) {
                    throw new AppError('Failed To logout',401);
                }
                res.status(StatusCode.OK).json({ message: 'Logout successful' });
            });

        } catch (error:any) {
            next(error)
         }
    }

    public static async editAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = req.id
            const validatedData = await UserValidation.validateEditUser(req.body);
            const { username, email } = validatedData;
            let newUser = await UserService.editAccount(id, username, email)
            res.status(StatusCode.OK).json(newUser);
        } catch (error:any) {
            next(error)
         }
    }


    public static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = req.id
            let deletedAccount = await UserService.deleteAccount(id)
            if(!deletedAccount){
                throw new AppError('Book not found',404)
            }
            res.status(StatusCode.OK).json(deletedAccount);

        } catch (error:any) {
            next(error)
         }
    }

}