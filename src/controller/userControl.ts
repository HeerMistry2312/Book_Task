import { Request, Response } from "express";
import { UserService } from "../service/userService";
import { Types } from "mongoose";
import { AuthReq } from "../middleware/authentication";
import { BaseError, InternalServerError, BadRequestError, ErrorHandler } from '../error/errorHandler';
export class userControl {


    public static async signUp(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, email, role } = req.body;

            let newUser = await UserService.SignUp(username, password, email, role)

            res.status(200).send(newUser)
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async Login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            let user = await UserService.login(username, password)
            const sessionUser = req.session as unknown as { user: any }
            if (user) {
                sessionUser.user = user
                console.log(sessionUser.user)
                res.status(200).send(user);
            } else {
                throw new InternalServerError('Incorrect Credentials');
            }
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }

    public static async logout(req: Request, res: Response): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = (req as AuthReq).id
            await UserService.Logout(id);
            req.session.destroy((err) => {
                if (err) {
                    throw new InternalServerError('Failed To logout');
                }
                res.status(200).json({ message: 'Logout successful' });
            });

        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }

    public static async editAccount(req: Request, res: Response): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = (req as AuthReq).id
            const body = req.body;

            let newUser = await UserService.editAccount(id, body)
            res.status(200).json(newUser);
        } catch (error: any) {
            const customError: BaseError = ErrorHandler.handleError(error);
            res.status(customError.statusCode).json({
                error: {
                    message: customError.message
                }
            });
        }
    }


    public static async deleteAccount(req: Request, res: Response): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = (req as AuthReq).id

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