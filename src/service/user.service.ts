import { Role } from "../enum/imports";
import { User } from "../model/imports";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../utils/imports";
import StatusConstants from '../constant/status.constant';
import { SECRET_KEY } from "../config/imports";
import UserPipeline from "../query/user.query";
export default class UserService {
    public static async signUp(username: string, password: string, email: string, role: Role): Promise<object>{
            const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new AppError(StatusConstants.CONFLICT.body.message, StatusConstants.CONFLICT.httpStatusCode);
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username,email,password:hashedPassword,role})
        const user = await UserPipeline.userPipeline(newUser.id)
        return { message: "Sign Up Successfully", data: user };

    }


    public static async login(
        username: string,
        password: string
    ): Promise<object> {
        let user = await User.findOne({ where: { username } });
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
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "7h" });
        user.token = token;
        await user.save();

        const loggedUser = await UserPipeline.userPipeline(user.id)

        return { message: "login Successfully", data: loggedUser };
    }


    public static async logout(id: number | undefined): Promise<void> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        user.token = "";
        await user.save();
    }



    public static async editAccount(id: number | undefined, name: string|undefined, email: string|undefined): Promise<object> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        let update = await user.update({username: name, email:email})
        if (!update) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }

        const updatedData = await UserPipeline.userPipeline(update.id)

        return { message: "User Updated", updatedData: updatedData }
    }


    public static async deleteAccount(id: number | undefined, name: string|undefined, email: string|undefined): Promise<object> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
        }
        let deleteUser = await User.destroy({where:{username: name, email:email}})
        if (!deleteUser) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }

        const deleteData = await UserPipeline.userPipeline(user.id)

        return { message: "User Updated", updatedData: deleteData }
    }

}