import mongoose, { Document, Schema } from 'mongoose';
import { UserInterface } from './userModel';
import Book, { BookInterface } from './bookModel';

export interface cartItemInterface {
    book: mongoose.Types.ObjectId | BookInterface;
    quantity: number;
    totalPrice: number;
}

export interface cartInterface extends Document {
    userId: mongoose.Types.ObjectId | UserInterface;
    books: cartItemInterface[];
    totalAmount: number;
}

const cartItemSchema: Schema<cartItemInterface> = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true }
})

const cartSchema: Schema<cartInterface> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [cartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 }
})

cartSchema.pre<cartInterface>('save', async function (next) {
    let totalAmount = 0;
    for (const book of this.books) {
        const item = await Book.findById(book.book)
        if (item) {
            book.totalPrice = item.price * book.quantity;
            totalAmount += book.totalPrice;
        }
    }
    this.totalAmount = totalAmount;
    next();
})

const Cart = mongoose.model<cartInterface>('Cart', cartSchema);
export default Cart;