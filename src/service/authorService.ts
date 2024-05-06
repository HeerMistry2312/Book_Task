import User, { UserInterface } from "../model/userModel";
import Book from '../model/bookModel';


export class AuthorService {
    public static async CreateBook(title: string, author: string, categories: Array<string>, description: string, price: number): Promise<object> {
        let book = new Book({ title: title, author: author, categories: categories, description: description, price: price })
        let newBook = await book.save()
        return { message: "Book Added", data: newBook }
    }


    public static async UpdateBook(author: string, id: string, body: object): Promise<object | null> {
        let book = await Book.findById(id)
        if (!book) {
            return { message: "Book Not Found" }
        }
        if (book.author.toString() !== author) {
            return { message: "You are not Authorized to update this Book" }
        }
        book = await Book.findByIdAndUpdate(id, body, { new: true }).populate({ path: 'author', select: 'username' })
        return book
    }


    public static async DeleteBook(author: string, id: string): Promise<object | null> {
        let book = await Book.findById({ _id: id, author: author })
        if (!book) {
            return { message: "Book Not Found" }
        }
        if (book.author.toString() !== author) {
            return { message: "You are not Authorized to delete this Book" }
        }
        book = await Book.findByIdAndDelete(id)
        return book
    }


    public static async ShowMyBooks(author: string): Promise<object> {
        let book = await Book.find({ author: author }).populate({ path: 'author', select: 'username' })
        if (!book) {
            return { message: "Book Not Found" }
        }
        return book
    }


    public static async ShowBook(author_id: string, name: string): Promise<object | null> {
        let seekauthor = await User.findOne({ _id: author_id, role: 'author' })
        if (!seekauthor) {
            return { message: `No Author found` }
        }
        const book = await Book.find({ author: seekauthor._id, title: name }).populate({ path: 'author', select: 'username' })
        if (!book) {
            return { message: `No Book found with name as ${name}` }
        }
        return book
    }

}