import mongoose, { Document, Schema } from 'mongoose';
import { UserInterface } from './userModel';

export interface BookInterface extends Document {
    title: string;
    author: mongoose.Types.ObjectId | UserInterface;
    categories: string[];
    description: string;
    price: number;

}

const bookSchema = new Schema<BookInterface>({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    categories: [{ type: String, required: true }],
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const Book = mongoose.model<BookInterface>('Book', bookSchema);

export default Book;
