import { Role } from './../model/userModel';
import User, { UserInterface } from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
export class AdminService {
    public static async ApproveAuthor(id: string): Promise<object> {
        let user = await User.findByIdAndUpdate(id, { isApproved: true })
        if (!user) {
            return { message: "User Not Found" }
        }
        return user
    }


    public static async ApproveAdmin(id: string): Promise<object> {
        let user = await User.findByIdAndUpdate(id, { isApproved: true })
        if (!user) {
            return { message: "User Not Found" }
        }
        return user
    }
}