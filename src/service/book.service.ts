import StatusConstants from "../constant/status.constant";
import {Book} from "../model/imports";
import { BookPipelineBuilder } from "../query/imports";
import { AppError } from "../utils/imports";
export class BookService {
  public static async showBook(
    id: string,
  ): Promise<Object> {
    const book = await Book.findOne({title: id})
    if(!book){
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode)
    }
    const pipeline = BookPipelineBuilder.getBookDetailsPipeline(
      book._id
    );
    const books = await Book.aggregate(pipeline);
    const totalCount = await Book.countDocuments({ title: id });


    return {
      books,
      totalBooks: totalCount
    };
  }

  public static async showAllBooks(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string,
  ): Promise<Object> {
    const pipeline = BookPipelineBuilder.getAllBooksPipeline(
      page,
      pageSize,
      searchQuery,
      sortBy
    );
    const books = await Book.aggregate(pipeline);

    const totalcount = await Book.countDocuments({});
    const totalPages = Math.ceil(totalcount / pageSize);

    return {
      books,
      totalBooks: totalcount,
      totalPages,
      currentPage: page,
    };
  }
}
