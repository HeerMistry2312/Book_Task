import { Role } from './../model/userModel';
import User, { UserInterface } from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

export class UserService {

    public static async SignUp(username: string, password: string, email: string, role: Role): Promise<object> {
        if (await User.findOne({ email })) {
            return { message: "User Already Exists" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword, role })
        await newUser.save();
        return newUser;
    }



    public static async login(
        username: string,
        password: string
    ): Promise<object> {
        let user = await User.findOne({ username });
        if (!user) {
            return { message: "User Doesnt Exists" }
        }
        if (user.role === 'admin' || user.role === 'author') {
            if (!user.isApproved) {
                return { message: "Admin has not appove your request" };
            }
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { message: "Password Incorrect" };
        }
        const token = jwt.sign({ id: user._id, role: user.role }, "HeerMistry", { expiresIn: "7h" });
        user.token = token;
        return user;
    }


    public static async Logout(id: Types.ObjectId | undefined): Promise<void> {
        const user = await User.findById({ _id: id });
        if (user) {
            user.token = "";
            await user.save();
        }
    }
}