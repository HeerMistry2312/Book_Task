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
    searchQuery?: string,
    sortBy?: string,
  ): Promise<object>{
    // const result = BookPipeline.booksPipeline(page,pageSize,searchQuery,sortBy)
    const result = await Book.findAll({})
    const totalcount = (await Book.findAndCountAll()).count;
    const totalPages = Math.ceil(totalcount / pageSize);
console.log(result)
    return {
        result,
      totalBooks: totalcount,
      totalPages,
      currentPage: page,
    };
  }

}
