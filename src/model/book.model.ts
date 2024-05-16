import mongoose, { Document, Schema } from 'mongoose'
import { BookInterface } from '../interfaces/imports';

const bookSchema = new Schema<BookInterface>({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

const Book = mongoose.model<BookInterface>('Book', bookSchema);

export default Book;
