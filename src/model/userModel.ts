import mongoose, { Document, Schema } from 'mongoose';

export type Role = 'admin' | 'author' | 'customer';

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    role: Role;
    isApproved: Boolean;
    token?: string
}

const userSchema = new Schema<UserInterface>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'author', 'customer'], default: 'customer' },
    isApproved: { type: Boolean, default: false },
    token: String,
});

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;