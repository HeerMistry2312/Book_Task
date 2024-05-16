import { AppError } from "../utils/imports";
import { Role } from "../enum/imports";
import { Types } from "mongoose";
import {Category, Book, User} from "../model/imports";
import StatusConstants from "../constant/status.constant";
import { BookPipelineBuilder , AdminPipelineBuilder} from "../query/imports";

export class AdminService {
  public static async approveAuthor(id: string): Promise<object> {
    let user = await User.findById(id);
    if (!user) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    if (user.role !== Role.Author) {
      throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
    }
    return { data: user };
  }

  public static async approveAdmin(id: string): Promise<object> {
    let user = await User.findByIdAndUpdate(id, { isApproved: true });
    if (!user) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    if (user.role !== Role.Admin) {
      throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
    }
    return { data: user };
  }

  public static async createBook(title:string, author:string, categories:string[], description:string, price:number ): Promise<object> {
    const authid = await User.findOne({ username: author });
    if (!authid) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    const id: Types.ObjectId = authid!._id;

    const fetchid = await Category.find({name:{$in:[...categories]}})
      const categoriesID = fetchid.map(i => i._id)
      const newCategoriesIds = categoriesID

    let book = new Book({
      title,
      author: id,
      categories: newCategoriesIds,
      description,
      price,
    });
    let newBook = await book.save();
    const bookPipeline = await BookPipelineBuilder.getBookDetailsPipeline(
      book._id
    );
    const bookResult = await Book.aggregate(bookPipeline);
    return { message: "Book Created", data: bookResult };
  }

  public static async updateBook(
    id: string,
    title?: string|undefined, author?:string|undefined, categories?: (string|undefined)[], description?: string|undefined, price?: number|undefined
  ): Promise<object> {
    let book = await Book.findOne({ title: id });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (author !== undefined) {
      const authid = await User.findOne({ username: author });
      if (!authid) {
          throw new AppError(
              'Author not found',
              StatusConstants.NOT_FOUND.httpStatusCode
          );
      }
      book.author = authid._id;
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



  public static async deleteBook(id: string): Promise<object> {
    const deletebook = await Book.findOne({ title: id });
    if (!deletebook) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const bookPipeline = await BookPipelineBuilder.getBookDetailsPipeline(
      deletebook._id
    );
    const bookResult = await Book.aggregate(bookPipeline);
     await Book.findByIdAndDelete({ _id: deletebook._id })
        return { message: "Delete Success", data: bookResult };
  }




  public static async listofPendingReq(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {

    const pipeline = await AdminPipelineBuilder.pendinRequestPipeline(page,pageSize,searchQuery,sortBy)

    const user = await User.aggregate(pipeline);
    const totalCount = await Book.countDocuments({isApproved: false});
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
     users: user,
      totalUsers: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }
}
