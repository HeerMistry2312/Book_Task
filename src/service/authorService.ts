import User, { UserInterface } from "../model/userModel";
import Book from '../model/bookModel';
import { InternalServerError } from '../error/errorHandler';

export class AuthorService {
    public static async CreateBook(title: string, author: string, categories: Array<string>, description: string, price: number): Promise<object> {
        let book = new Book({ title: title, author: author, categories: categories, description: description, price: price })
        let newBook = await book.save()
        return { message: "Book Added", data: newBook }
    }


    public static async UpdateBook(author: string, id: string, body: object): Promise<object | null> {
        let book = await Book.findById(id)
        if (!book) {
            throw new InternalServerError('Book Not Found');
        }
        if (book.author.toString() !== author) {
            throw new InternalServerError('You are not authorized to edit this book');
        }
        book = await Book.findByIdAndUpdate(id, body, { new: true }).populate({ path: 'author', select: 'username' })
        return { message: "Book Updated", data: book }
    }


    public static async DeleteBook(author: string, id: string): Promise<object | null> {
        let book = await Book.findById({ _id: id, author: author })
        if (!book) {
            throw new InternalServerError('Book Not FOund');
        }
        if (book.author.toString() !== author) {
            throw new InternalServerError('You are not authorized to delete this book');
        }
        book = await Book.findByIdAndDelete(id)
        return { message: "Book Deleted", deletedData: book }
    }


    public static async ShowMyBooks(author: string): Promise<object> {
        let book = await Book.find({ author: author }).populate({ path: 'author', select: 'username' })
        if (!book) {
            throw new InternalServerError('Book Not Found');
        }
        return book
    }


    public static async ShowBook(author_id: string, name: string): Promise<object | null> {
        let seekauthor = await User.findOne({ _id: author_id, role: 'author' })
        if (!seekauthor) {
            throw new InternalServerError('Author Not Found');
        }
        const book = await Book.find({ author: seekauthor._id, title: name }).populate({ path: 'author', select: 'username' })
        if (!book) {
            throw new InternalServerError('Book Not Found');
        }
        return book
    }

}