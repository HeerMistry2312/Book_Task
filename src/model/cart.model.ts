import mongoose, { Document, Schema } from 'mongoose';
import Book from './book.model';
import { CartItemInterface, CartInterface } from '../interfaces/imports';

const cartItemSchema: Schema<CartItemInterface> = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number }
})

const cartSchema: Schema<CartInterface> = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    books: [cartItemSchema],
    totalAmount: { type: Number, default: 0 }
})

cartSchema.pre<CartInterface>('save', async function (next) {
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

const Cart = mongoose.model<CartInterface>('Cart', cartSchema);
export default Cart;