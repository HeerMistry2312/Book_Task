import { Role } from './../model/userModel';
import User, { UserInterface } from "../model/userModel";
import Book from '../model/bookModel';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
export class AdminService {
    public static async ApproveAuthor(id: string): Promise<object> {
        let user = await User.findByIdAndUpdate(id)
        if (!user) {
            return { message: "User Not Found" }
        }
        if (user.role !== 'author') {
            return { message: "user not registered as author" }
        }
        return { data: user }
    }


    public static async ApproveAdmin(id: string): Promise<object> {
        let user = await User.findByIdAndUpdate(id, { isApproved: true })
        if (!user) {
            return { message: "User Not Found" }
        }
        if (user.role !== 'admin') {
            return { message: "user not registered as admin" }
        }
        return { data: user }
    }


    public static async CreateBook(title: string, author: string, categories: Array<string>, description: string, price: number): Promise<object> {
        let book = new Book({ title: title, author: author, categories: categories, description: description, price: price })
        let newBook = await book.save()
        return newBook
    }


    public static async UpdateBook(id: string, body: object): Promise<object> {
        let update = await Book.findByIdAndUpdate(id, body, { new: true })
        if (!update) {
            return { message: "Book Not Found" }
        }
        return { message: "Update Success", data: update }
    }


    public static async DeleteBook(id: string): Promise<object> {
        const book = await Book.findByIdAndDelete({ _id: id })
        if (!book) {
            return { message: "Book Not FOund" }
        }
        return { message: "Delete Success", data: book }
    }
}