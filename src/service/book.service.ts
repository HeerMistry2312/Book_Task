import StatusConstants from "../constant/status.constant";
import {Book} from "../model/imports";
import {BookPipeline} from "../query/imports";
import { AppError } from "../utils/imports";
export class BookService {
  public static async showBook(
    id: string,
  ): Promise<Object> {
    const book = await Book.findOne({where: {Bookname: id}})
    if(!book){
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode)
    }
    const result = await BookPipeline.bookDetailPipeline(
      book.id
    );
    const totalCount = (await Book.findAndCountAll({where:{id:book.id}})).count
    return {
      result,
      totalBooks: totalCount
    };
  }


  public static async showAllBooks(
    page: number,
    pageSize: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string
  ): Promise<object>{
    const result = await BookPipeline.bookPipeline(page,pageSize,searchQuery,sortBy,sortOrder)

    return result
  }

}
