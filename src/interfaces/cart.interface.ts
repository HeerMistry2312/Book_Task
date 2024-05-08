import mongoose, { Document } from "mongoose";
import { BookInterface } from "./book.interface";
import { UserInterface } from "./user.interface";
export interface cartItemInterface {
    book: mongoose.Types.ObjectId | BookInterface;
    quantity: number;
    totalPrice?: number;
}

export interface cartInterface extends Document {
    userId: mongoose.Types.ObjectId | UserInterface;
    books: cartItemInterface[];
    totalAmount?: number;
}
