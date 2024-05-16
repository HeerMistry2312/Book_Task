import mongoose, { Document } from "mongoose";
import { BookInterface, UserInterface } from "../interfaces/imports"
export interface CartItemInterface {
    book: mongoose.Types.ObjectId | BookInterface;
    quantity: number;
    totalPrice?: number;
}

export interface CartInterface extends Document {
    userId: mongoose.Types.ObjectId | UserInterface;
    books: CartItemInterface[];
    totalAmount?: number;
}
