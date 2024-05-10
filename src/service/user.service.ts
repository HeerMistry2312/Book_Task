import { Role } from '../interfaces/user.interface';
import User from '../model/user.model';
import Cart from '../model/cart.model';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { AppError } from "../utils/customErrorHandler";
import { SECRET_KEY } from "../config/config";
import StatusConstants from '../constant/status.constant';
export default class UserService {

    public static async signUp(username: string, password: string, email: string, role: Role): Promise<object> {
        if (await User.findOne({ email })) {
            throw new AppError(StatusConstants.CONFLICT.body.message,StatusConstants.CONFLICT.httpStatusCode);
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
            throw new AppError("User Doesn't Exist",404);
        }
        if ((user.role === Role.Admin || user.role === Role.Author) && !user.isApproved) {
                throw new AppError('Admin has not approve your Request',403);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        if (!SECRET_KEY) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: "7h" });
        user.token = token;
        return { message: "login Successfully", data: user };
    }



    public static async logout(id: Types.ObjectId | undefined): Promise<void> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        user.token = "";
        await user.save();
    }

    public static async editAccount(id: Types.ObjectId | undefined, name: string, email: string): Promise<object> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        let update = await User.findByIdAndUpdate(id, {username: name, email:email}, { new: true })
        if (!update) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        return { message: "User Updated", updatedData: update }
    }

    public static async deleteAccount(id: Types.ObjectId | undefined): Promise<object> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        const deleted = await User.findByIdAndDelete({ _id: id })
        if (!deleted) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const deletedCart = await Cart.findOneAndDelete({ userId: id })
        if (!deletedCart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        return { message: "User Deleted", deletedUserData: deleted, deletedCartData: deletedCart }
    }

}