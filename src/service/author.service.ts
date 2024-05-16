import User from "../model/user.model";
import { Role } from "../interfaces/user.interface";
import { AppError } from "../utils/customErrorHandler";
import Book from "../model/book.model";
import Category from "../model/category.model";
import { BookInterface } from "../interfaces/book.interface";
import StatusConstants from "../constant/status.constant";
import { Types } from "mongoose";
import { BookPipelineBuilder } from "../query/book.query";
export class AuthorService {
  public static async createBook(
    author: string,
    title:string,
    categories:string[],
    description:string,
    price:number
  ): Promise<object> {

    const authid = await User.findById({ _id: author });
    if (!authid) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const id: Types.ObjectId = authid!._id;

    const fetchid = await Category.find({ name: { $in: [...categories] } });
    const categoriesID = fetchid.map((i) => i._id);
    const newCategoriesIds = categoriesID;

    let book = new Book({
      title,
      author: id,
      categories: newCategoriesIds,
      description,
      price,
    });
    let newBook = await book.save();
    const bookPipeline = await BookPipelineBuilder.getBookDetailsPipeline(
      newBook._id
    );
    const bookResult = await Book.aggregate(bookPipeline);

    return { message: "Book Created", data: bookResult };
  }

  public static async updateBook(
    author: string,
    id: string,
    title?: string|undefined, categories?: (string|undefined)[], description?: string|undefined, price?: number|undefined
  ): Promise<object | null> {
    let book = await Book.findOne({ title: id });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (book.author.toString() !== author) {
      throw new AppError(
        StatusConstants.BAD_REQUEST.body.message,
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }
    if (categories) {
      const fetchCategories = await Category.find({
          name: { $in: categories.filter(c => !!c) }
      });
      const categoryIds = fetchCategories.map(c => c._id);
      book.categories = categoryIds;
  }
  if (title) book.title = title;
  if (description) book.description = description;
  if (price) book.price = price;
  await book.save();
    const bookPipeline = await BookPipelineBuilder.getBookDetailsPipeline(
      book._id
    );
    const bookResult = await Book.aggregate(bookPipeline);
    return { message: "Book Updated", data: bookResult };
  }

  public static async deleteBook(
    author: string,
    id: string
  ): Promise<object | null> {
    let book = await Book.findOne({ title: id, author: author });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (book.author.toString() !== author) {
      throw new AppError(
        StatusConstants.BAD_REQUEST.body.message,
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }
    const bookPipeline = await BookPipelineBuilder.getBookDetailsPipeline(
      book._id
    );
    const bookResult = await Book.aggregate(bookPipeline);
    book = await Book.findByIdAndDelete(book._id);

    return { message: "Book Deleted", deletedData: bookResult };
  }

  public static async showMyBooks(
    author: string,
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const bookPipeline = await BookPipelineBuilder.getAllBooksPipeline(
      page,
      pageSize,
      searchQuery,
      sortBy,
      author
    );
    const books = await Book.aggregate(bookPipeline);
    const totalCount = await Book.countDocuments({ author: author });
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      books: books,
      totalBooks: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }

  public static async showBook(
    author_id: string,
    name: string
  ): Promise<object | null> {
    let seekauthor = await User.findOne({ _id: author_id, role: Role.Author });
    if (!seekauthor) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const book = await Book.findOne({ author: seekauthor._id, title: name })
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    const bookPipeline = await BookPipelineBuilder.getBookDetailsPipeline(
      book._id
    );
    const bookResult = await Book.aggregate(bookPipeline);
    return bookResult;
  }
}
