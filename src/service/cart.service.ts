import {Book,User,Cart} from '../model/imports';
import { CartInterface,CartItemInterface } from '../interfaces/imports';
import { Types } from 'mongoose';
import fs from "fs";
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import path from "path";
import { AppError } from "../utils/imports";
import StatusConstants from '../constant/status.constant';
import { CartPipelineBuilder } from '../query/imports';

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
    const cart = await Cart.findOne({ userId: id }).populate('books.book');
    if (!cart) {
        throw new AppError(StatusConstants.NOT_FOUND.body.message, StatusConstants.NOT_FOUND.httpStatusCode);
    }
    const user = await User.findOne({ _id: id });
    if (!user) {
        throw new AppError(StatusConstants.NOT_FOUND.body.message, StatusConstants.NOT_FOUND.httpStatusCode);
    }

    const templateHtml = fs.readFileSync(path.join('src','templates', 'template.html'), 'utf8');
    const template = handlebars.compile(templateHtml);

    const books = cart.books.map((item: any) => ({
        title: item.book.title,
        quantity: item.quantity,
        price: item.book.price,
        totalPrice: item.totalPrice,
    }));

    const data = {
        username: user.username,
        role: user.role,
        email: user.email,
        books,
        totalAmount: cart.totalAmount,
    };

    const html = template(data);

    let browser;
        try {
            browser = await puppeteer.launch({
                headless: true,
                slowMo: 50,
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                timeout: 60000,
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });

            const fileName = `${user.username}_cart.pdf`;
            const filePath = path.join('src', 'PDF', fileName);
            await page.pdf({ path: filePath, format: 'A4' });

            return filePath;
        } catch (error) {
            console.error("Puppeteer error:", error);
            throw new AppError("Failed to generate PDF", StatusConstants.INTERNAL_SERVER_ERROR.httpStatusCode);
        } finally {
            if (browser) {
                await browser.close();
            }

        }
    }
}