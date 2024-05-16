import mongoose, { Schema } from 'mongoose';
import { Role, UserInterface } from '../interfaces/user.interface';

const userSchema = new Schema<UserInterface>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: [Role.Admin, Role.Author, Role.Customer], default: Role.Customer },
    isApproved: { type: Boolean, default: false },
    token: String,
}, { timestamps: true });

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;