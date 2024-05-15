import Book from '../model/book.model';
import User from '../model/user.model';
import Cart from '../model/cart.model';
import { CartInterface,CartItemInterface } from '../interfaces/cart.interface';
import { Types } from 'mongoose';
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from '../constant/status.constant';
import { CartPipelineBuilder } from '../query/cart.query';
export class CartService {
    public static async goToCart(id: string): Promise<object> {
        const cart = await Cart.findOne({ userId: id })

        if (!cart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const cartPipeline = await CartPipelineBuilder.cartPipeline(cart._id)
        const cartResult = await Cart.aggregate(cartPipeline)
        return cartResult
    }



    public static async addToCart(id: string, bookName: string, quantity: number): Promise<object> {
        const book = await Book.findOne({ title: bookName })
        if (!book) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const cartItem: CartItemInterface = {
            book: new Types.ObjectId(book._id),
            quantity: quantity
        }
        let cart = await Cart.findOne({ userId: id })
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
        const cartPipeline = await CartPipelineBuilder.cartPipeline(cart._id)
        const cartResult = await Cart.aggregate(cartPipeline)
        return { message: "Book Added to Your Cart", data: cartResult }
    }




    public static async decrementBook(id: string, bookName: string): Promise<CartInterface | object> {
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        let cart = await Cart.findOne({ userId: id })
        if (!cart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const index = cart.books.findIndex(item => item.book._id.equals(book._id));
        if (index === -1) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        cart.books[index].quantity--;
        if (cart.books[index].quantity === 0) {
            cart.books.splice(index, 1);
        }
        cart = await cart.save();
        const cartPipeline = await CartPipelineBuilder.cartPipeline(cart._id)
        const cartResult = await Cart.aggregate(cartPipeline)
        return cartResult
    }




    public static async removeBook(id: string, bookName: string): Promise<CartInterface | object> {
        const book = await Book.findOne({ title: bookName });
        if (!book) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        let cart = await Cart.findOne({ userId: id })
        if (!cart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        const index = cart.books.findIndex(item => item.book._id.equals(book._id));
        if (index === -1) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        cart.books.splice(index, 1);
        cart = await cart.save();
        const cartPipeline = await CartPipelineBuilder.cartPipeline(cart._id)
        const cartResult = await Cart.aggregate(cartPipeline)
        return { message: "Book Removed from Your Cart", data: cartResult }

    }




    public static async emptyCart(id: string): Promise<CartInterface | object> {
        let cart = await Cart.findOne({ userId: id })
        if (!cart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
        }
        cart.books = []
        cart = await cart.save()
        const cartPipeline = await CartPipelineBuilder.cartPipeline(cart._id)
        const cartResult = await Cart.aggregate(cartPipeline)
        return { message: "Cart is Empty Now", data: cartResult }
    }




    public static async downloadFile(id: string): Promise<string> {
        const cart = await Cart.findOne({ userId: id });
        if (!cart) {
            throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
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