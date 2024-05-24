import { User, Book, Category, BookCategory } from "../model/imports";
import { AppError } from "../utils/imports";
import StatusConstants from "../constant/status.constant";
import { BookPipeline } from "../query/imports";
export class AuthorService {
  public static async createBook(
    author: number,
    title: string,
    isbn: number,
    categories: string[],
    description: string,
    price: number
  ): Promise<object> {
    const authid = await User.findByPk(author);

    if (!authid) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const book = await Book.create({
      Bookname: title,
      author: authid.id,
      ISBN: isbn,
      description: description,
      price: price,
    });

    const fetchid = await Category.findAll({ where: { name: categories } });
    const categoriesID = fetchid.map((i) => i.id);
    const newCategoriesIds = categoriesID;
    const bookCategoryEntries = newCategoriesIds.map((categoryId) => ({
      BookId: book.id,
      CategoryId: categoryId,
    }));
    await BookCategory.bulkCreate(bookCategoryEntries);

    const result = await BookPipeline.bookDetailPipeline(book.id);
    return { message: "Book Created", data: result };
  }

  public static async updateBook(
    author: number,
    id: string,
    title?: string,
    isbn?: number,
    categories?: string[],
    description?: string,
    price?: number
  ): Promise<object> {
    const book = await Book.findOne({ where: { Bookname: id } });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (author !== book.author) {
        throw new AppError(
            StatusConstants.NOT_FOUND.body.message,
            StatusConstants.NOT_FOUND.httpStatusCode
          );
    }
    const updateBook = await book.update({
      Bookname: title ? title : book.Bookname,
      author: book.author,
      ISBN: isbn ? isbn : book.ISBN,
      description: description ? description : book.description,
      price: price ? price : book.price,
    });

    if (categories !== undefined) {
      await BookCategory.destroy({ where: { BookId: book.id } });
      const fetchid = await Category.findAll({ where: { name: categories } });
      const categoriesID = fetchid.map((i) => i.id);
      const newCategoriesIds = categoriesID;
      const bookCategoryEntries = newCategoriesIds.map((categoryId) => ({
        BookId: book.id,
        CategoryId: categoryId,
      }));
      await BookCategory.bulkCreate(bookCategoryEntries);
    }

    const result = await BookPipeline.bookDetailPipeline(updateBook.id);
    return { message: "Book Updated", data: result };
  }

  public static async deleteBook(
    author: number,
    id: string
  ): Promise<object> {
    const deletebook = await Book.findOne({ where: { Bookname: id } });
    if (!deletebook) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (author !== deletebook.author) {
        throw new AppError(
            StatusConstants.UNAUTHORIZED.body.message,
            StatusConstants.UNAUTHORIZED.httpStatusCode
          );
    }
    const result = await BookPipeline.bookDetailPipeline(deletebook.id);
    await Book.destroy({ where: { id: deletebook.id } });
    return { message: "Delete Success", data: result };
  }

  public static async showMyBooks(
    author: number,
    page: number,
    pageSize: number,
    searchQuery: string,
    sortBy: string,
    sortOrder:string
  ): Promise<object> {
    const bookPipeline = await BookPipeline.authorBookPipeline(
      author,page,pageSize,searchQuery,sortBy,sortOrder
    );
    return {
      books: bookPipeline
    };
  }

  public static async showBook(
    author_id: number,
    name: string
  ): Promise<object> {
    const book = await Book.findOne({ where: { Bookname: name } });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (author_id !== book.author) {
        throw new AppError(
            StatusConstants.NOT_FOUND.body.message,
            StatusConstants.NOT_FOUND.httpStatusCode
          );
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
}
