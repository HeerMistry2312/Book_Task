import { Role } from '../enum/imports';
import {User,Cart} from '../model/imports';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { AppError } from "../utils/imports";
import { SECRET_KEY } from "../config/imports";
import StatusConstants from '../constant/status.constant';
import { UserPipelineBuilder } from '../query/imports';
export default class UserService {

    public static async signUp(username: string, password: string, email: string, role: Role): Promise<object> {
        if (await User.findOne({ email })) {
            throw new AppError(StatusConstants.CONFLICT.body.message,StatusConstants.CONFLICT.httpStatusCode);
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword, role })
        await newUser.save();
        const userPipeline = await UserPipelineBuilder.userPipeline(newUser._id)
        const user = await User.aggregate(userPipeline)
        return { message: "Sign Up Successfully", data: user };
    }



    public static async login(
        username: string,
        password: string
    ): Promise<object> {
        let user = await User.findOne({ username });
        if (!user) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        if ((user.role === Role.Admin || user.role === Role.Author) && !user.isApproved) {
                throw new AppError(StatusConstants.FORBIDDEN.body.message, StatusConstants.FORBIDDEN.httpStatusCode);
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
        await user.save();
        const userPipeline = await UserPipelineBuilder.userPipeline(user._id)
        const loggesUser = await User.aggregate(userPipeline)

        return { message: "login Successfully", data: loggesUser };
    }



    public static async logout(id: Types.ObjectId | undefined): Promise<void> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        user.token = "";
        await user.save();
    }



    public static async editAccount(id: Types.ObjectId | undefined, name: string|undefined, email: string|undefined): Promise<object> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        let update = await User.findByIdAndUpdate(id, {username: name, email:email}, { new: true })
        if (!update) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const userPipeline = await UserPipelineBuilder.userPipeline(update._id)
        const updatedUser = await User.aggregate(userPipeline)
        return { message: "User Updated", updatedData: updatedUser }
    }





    public static async deleteAccount(id: Types.ObjectId | undefined): Promise<object> {
        const user = await User.findById({ _id: id });
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        const deleteCart = await Cart.findOne({ userId: id })
        if (!deleteCart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const userPipeline = await UserPipelineBuilder.userPipeline(user._id)
        const deleteUser = await User.aggregate(userPipeline)
        const cartPipeline = await UserPipelineBuilder.deleteCartPipeline(deleteCart._id)
        const cartResult = await Cart.aggregate(cartPipeline)
        await Cart.findByIdAndDelete({_id:deleteCart._id})
        await User.findByIdAndDelete({ _id: user._id })
        return { message: "User Deleted", deletedUserData: deleteUser, deletedCartData: cartResult }
    }

}