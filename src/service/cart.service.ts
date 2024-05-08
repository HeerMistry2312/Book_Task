import Book from '../model/book.model';
import User from '../model/user.model';
import Cart from '../model/cart.model';
import { cartInterface,cartItemInterface } from '../interfaces/cart.interface';
import { Types } from 'mongoose';
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";
import { InternalServerError } from '../error/errorHandler';

export class CartService {
    public static async goToCart(id: string): Promise<object> {
        const cart = await Cart.findOne({ userId: id }).populate({
            path: 'books.book',
            populate: [{
                path: 'author',
                select: ['username','-_id']
            }, {
                path: 'categories',
                select: ['name','-_id']
            }]
        }
        )
        if (!cart) {
            throw new InternalServerError('Cart is Empty');
        }
        return cart
    }


    public static async addToCart(id: string, bookName: string, quantity: number): Promise<object> {
        const book = await Book.findOne({ title: bookName })
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        const cartItem: cartItemInterface = {
            book: new Types.ObjectId(book._id),
            quantity: quantity
        }
        let cart = await Cart.findOne({ userId: id }).populate({
            path: 'books.book',
            populate: [{
                path: 'author',
                select: ['username','-_id']
            }, {
                path: 'categories',
                select: ['name','-_id']
            }]
        }
        )
        if (!cart) {
            cart = new Cart({ userId: id, books: [cartItem] })

        } else {
            const existingItem = cart.books.find(item => item.book.equals(book._id));
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.books.push(cartItem);
            }
        }
        cart = await cart.save()
        return { message: "Book Added to Your Cart", data: cart }
    }


    public static async decrementBook(id: string, bookName: string): Promise<cartInterface | object> {
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            throw new InternalServerError('Book Not Found');
        }
        let cart = await Cart.findOne({ userId: id }).populate({
            path: 'books.book',
            populate: [{
                path: 'author',
                select: 'username'
            }, {
                path: 'categories',
                select: 'name'
            }]
        }
        );
        if (!cart) {
            throw new InternalServerError('Cart Not Found');
        }
        const index = cart.books.findIndex(item => item.book._id.equals(book._id));
        if (index === -1) {
            throw new InternalServerError('book not found in cart');
        }
        cart.books[index].quantity--;
        if (cart.books[index].quantity === 0) {
            cart.books.splice(index, 1);
        }
        cart = await cart.save();
        return cart
    }


    public static async removeBook(id: string, bookName: string): Promise<cartInterface | object> {
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            throw new InternalServerError('User Not Found');
        }
        let cart = await Cart.findOne({ userId: id }).populate({
            path: 'books.book',
            populate: [{
                path: 'author',
                select: 'username'
            }, {
                path: 'categories',
                select: 'name'
            }]
        }
        );
        if (!cart) {
            throw new InternalServerError('Cart Not Found');
        }
        const index = cart.books.findIndex(item => item.book._id.equals(book._id));
        if (index === -1) {
            throw new InternalServerError('Book Not Found in Cart');
        }
        cart.books.splice(index, 1);
        cart = await cart.save();
        return { message: "Book Removed from Your Cart", data: cart }

    }


    public static async emptyCart(id: string): Promise<cartInterface | object> {
        let cart = await Cart.findOne({ userId: id }).populate({
            path: 'books.book',
            populate: [{
                path: 'author',
                select: 'username'
            }, {
                path: 'categories',
                select: 'name'
            }]
        }
        );
        if (!cart) {
            throw new InternalServerError('Cart Not Found');
        }
        cart.books = []
        cart = await cart.save()
        return { message: "Cart is Empty Now", data: cart }
    }


    public static async downloadFile(id: string): Promise<string> {
        const cart = await Cart.findOne({ userId: id });
        if (!cart) {
            throw new InternalServerError('Cart Not Found');
        }
        const user = await User.findOne({ _id: id });
        const doc = new PDFDocument();
        const fileName = `${user?.username}_cart.pdf`;

        const filePath = path.join("src", "PDF", fileName);

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(20).text("Cart Details", { align: "center" });
        doc.moveDown();
        doc.fontSize(16).text(`User Name: ${user?.username}`);
        doc.moveDown();
        doc.fontSize(16).text(`Role: ${user?.role}`);
        doc.moveDown();
        doc.fontSize(16).text(`Email: ${user?.email}`);
        doc.moveDown()
        doc.fontSize(16).font("Helvetica-Bold").text("Books:", { underline: true });
        doc.moveDown();


        let Ycod = doc.y;
        doc.font("Helvetica-Bold").text("Book Title", 70, Ycod);
        doc.text("Quantity", 250, Ycod);
        doc.text("Price", 350, Ycod);
        doc.text("Total Price", 450, Ycod);
        doc.moveDown();
        let books = await Book.find({});

        cart.books.forEach((item) => {
            const book = books.find((b) => b._id.equals(item.book));
            if (book) {
                let Ycod = doc.y;
                doc.font("Helvetica").text(book.title, 70, Ycod);
                doc.text(item.quantity.toString(), 250, Ycod);
                doc.text(book.price.toString(), 350, Ycod);
                doc.text(item.totalPrice!.toString(), 450, Ycod);
                doc.moveDown();
            }
        });

        doc.moveDown();
        doc
            .font("Helvetica-Bold")
            .text(`Total Amount: ${cart.totalAmount}`, 350, doc.y);

        doc.end();

        return filePath;
    }
}