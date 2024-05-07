import mongoose, { Document, Schema } from 'mongoose';
import { UserInterface } from './userModel';
import Category, { CategoryInterface } from './category';
export interface BookInterface extends Document {
    title: string;
    author: mongoose.Types.ObjectId | UserInterface;
    categories: mongoose.Types.ObjectId[] | CategoryInterface[];
    description: string;
    price: number;

}

const bookSchema = new Schema<BookInterface>({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const Book = mongoose.model<BookInterface>('Book', bookSchema);

export default Book;
