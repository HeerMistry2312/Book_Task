import { Document } from 'mongoose';
export enum Role {
    Admin = 'admin',
    Author = 'author',
    Customer = 'customer',
}
export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
    role: Role;
    isApproved: Boolean;
    token?: string
}