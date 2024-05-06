import { Request, Response } from "express";
import { UserService } from "../service/userService";
import { Types } from "mongoose";
import { AuthReq } from "../middleware/authentication";

export class userControl {


    public static async signUp(req: Request, res: Response): Promise<void> {
        try {
            const { username, password, email, role } = req.body;

            let newUser = await UserService.SignUp(username, password, email, role)

            res.status(200).send({ data: `${newUser} Register Sucessfully` })
        } catch (error: any) {
            console.log("error ma chhu")
            res.send({ messgae: error })
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
                res.status(200).send({ message: "User logged in successfully", data: user });
            } else {
                res.status(401).send({ message: "Invalid username or password" });
            }
        } catch (error: any) {
            res.send({ messgae: error })
        }
    }

    public static async logout(req: Request, res: Response): Promise<void> {
        try {
            const id: Types.ObjectId | undefined = (req as AuthReq).id
            await UserService.Logout(id);
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).json({ error: 'Failed to logout' });
                }
                res.status(200).json({ message: 'Logout successful' });
            });

        } catch (error) {
            console.error('Error in logout:', error);
            res.status(500).json({ error: 'Failed to logout' });
        }
    }



    // public static async deleteAccount(req: Request, res: Response): Promise<void>{
    //     try{

    //     }
    // }

}