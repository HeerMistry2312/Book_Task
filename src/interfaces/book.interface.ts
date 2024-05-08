import mongoose, { Document } from 'mongoose';
import { UserInterface } from './user.interface';
import { CategoryInterface } from './category.interface';
export interface BookInterface extends Document {
    title: string;
    author: mongoose.Types.ObjectId | UserInterface;
    categories: mongoose.Types.ObjectId[] | CategoryInterface[];
    description: string;
    price: number;

}