import mongoose, { Document } from 'mongoose';
import { CategoryInterface, UserInterface } from "../interfaces/imports"
export interface BookInterface extends Document {
    title: string;
    author: mongoose.Types.ObjectId | UserInterface;
    categories: mongoose.Types.ObjectId[] | CategoryInterface[];
    description: string;
    price: number;

}