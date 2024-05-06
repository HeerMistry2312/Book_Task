import { InternalServerError } from '../error/errorHandler';
import User, { UserInterface } from "../model/userModel";
import Book from '../model/bookModel';

export class AdminService {
    public static async ApproveAuthor(id: string): Promise<object> {
        let user = await User.findByIdAndUpdate(id)
        if (!user) {
            throw new InternalServerError('User not Found');
        }
        if (user.role !== 'author') {
            throw new InternalServerError('User Not Register as Author');
        }
        return { data: user }
    }


    public static async ApproveAdmin(id: string): Promise<object> {
        let user = await User.findByIdAndUpdate(id, { isApproved: true })
        if (!user) {
            throw new InternalServerError('User not Found');
        }
        if (user.role !== 'admin') {
            throw new InternalServerError('User Not Register as Admin');
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
            throw new InternalServerError('Book Not Found');
        }
        return { message: "Update Success", data: update }
    }


    public static async DeleteBook(id: string): Promise<object> {
        const book = await Book.findByIdAndDelete({ _id: id })
        if (!book) {
            throw new InternalServerError('Book Not Found');
        }
        return { message: "Delete Success", data: book }
    }
}