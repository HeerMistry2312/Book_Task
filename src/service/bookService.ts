import Book from '../model/bookModel';
import User from '../model/userModel';
import { InternalServerError } from '../error/errorHandler';

export class BookService {
    public static async ShowBook(id: string): Promise<object> {
        let book = await Book.find({ title: id }).populate({ path: 'author', select: 'username' })
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        return book
    }


    public static async ShowAllBooks(): Promise<object> {
        let book = await Book.find({}).populate({ path: 'author', select: 'username' })
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        return book
    }


    public static async ShowByCategory(category: string): Promise<object> {
        const book = await Book.find({ categories: category }).populate({ path: 'author', select: 'username' });
        if (!book) {
            throw new InternalServerError('Book not Found');
        }
        return book;
    }


    public static async ShowByAuthor(id: string): Promise<object> {
        let author = await User.findOne({ username: id, role: 'author' })
        if (!author) {
            throw new InternalServerError(`No Author found with name of ${id}`);
        }
        const book = await Book.find({ author: author._id }).populate({ path: 'author', select: 'username' })
        if (!book) {
            throw new InternalServerError(`No Book found with name of author as ${id}`);
        }
        return book
    }
}