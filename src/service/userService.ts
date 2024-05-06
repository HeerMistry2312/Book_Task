import { Role } from './../model/userModel';
import User, { UserInterface } from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { InternalServerError } from '../error/errorHandler';
import { SECRET_KEY } from "../config/config";
export class UserService {

    public static async SignUp(username: string, password: string, email: string, role: Role): Promise<object> {
        if (await User.findOne({ email })) {
            throw new InternalServerError('User Alredy Exist');
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword, role })
        await newUser.save();
        return { message: "Sign Up Successfully", data: newUser };
    }



    public static async login(
        username: string,
        password: string
    ): Promise<object> {
        let user = await User.findOne({ username });
        if (!user) {
            throw new InternalServerError("User Doesn't Exist");
        }
        if (user.role === 'admin' || user.role === 'author') {
            if (!user.isApproved) {
                throw new InternalServerError('Admin has not approve your Request');
            }
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new InternalServerError('Password Incorrect');
        }
        if (!SECRET_KEY) {
            throw new InternalServerError('SECRET_KEY is not defined');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "7h" });
        user.token = token;
        return { message: "login Successfully", data: user };
    }



    public static async Logout(id: Types.ObjectId | undefined): Promise<void> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new InternalServerError('User Not logged in');
        }
        user.token = "";
        await user.save();
    }
}