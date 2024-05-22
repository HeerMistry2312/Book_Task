import { User, Book, BookCategory, Category } from "../model/imports";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";
export default class BookPipeline {
  public static async bookDetailPipeline(id: number): Promise<object> {
    try {
      const book = await Book.findByPk(id);
      if (!book) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      const user = await User.findByPk(book.author);
      if (!user) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      const categories = await Category.findAll({
        attributes: ["name"],
        include: [
          {
            model: BookCategory,
            where: { BookId: id },
            attributes: [],
          },
        ],
      });

      const categoryNames = categories.map((category) => category.name);

      const data = {
        Bookname: book.Bookname,
        Author: user.username,
        ISBN: book.ISBN,
        Categories: categoryNames,
        Description: book.description,
        Price: book.price,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  //   public static async booksPipeline(
  //     page: number,
  //     pageSize: number,
  //     searchQuery?: string,
  //     sortBy?: string
  //   ): Promise<object> {
  //     try {

  //     } catch (error: any) {
  //       throw error;
  //     }
  //   }
}
