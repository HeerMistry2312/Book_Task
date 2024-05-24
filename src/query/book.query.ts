import { User, Book, BookCategory, Category } from "../model/imports";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";
import { PaginationBuilder } from "../utils/searchingSorting";
export default class BookPipeline {
  public static async bookDetailPipeline(id: number) {
    try {
      const book = await Book.findByPk(id);
      if (!book) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      const bookData = await Book.findAll({
        where: { id: book.id },
        attributes: ["Bookname", "ISBN", "description", "price"],
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Category,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
      });
      const processedBooks = bookData.map((book) => ({
        Bookname: book.Bookname,
        ISBN: book.ISBN,
        description: book.description,
        price: book.price,
        author: book.User.username,
        categories:
          book.Categories.map(
            (category: { name: string }) => category.name
          ).join(", ") || "No Categories",
      }));

      return processedBooks;
    } catch (error: any) {
      throw error;
    }
  }

  public static async bookPipeline(
    page: number,
    pageSize: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string
  ) {
    try {
      const offset = (page - 1) * pageSize;

      const bookData = await Book.findAll({
        attributes: ["Bookname", "ISBN", "description", "price"],
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Category,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      const processedBooks = bookData.map((book) => ({
        Bookname: book.Bookname,
        ISBN: book.ISBN,
        description: book.description,
        price: book.price,
        author: book.User.username,
        categories:
          book.Categories.map(
            (category: { name: string }) => category.name
          ).join(", ") || "No Categories",
      }));
      const filteredData = PaginationBuilder.searchingItems(
        processedBooks,
        searchQuery
      );
      const sortedData = PaginationBuilder.sortingItems(
        filteredData,
        sortBy,
        sortOrder
      );
      const paginatedData = PaginationBuilder.paginateItems(
        sortedData,
        offset,
        pageSize
      );

      return {
        data: paginatedData,
        totalBooks: filteredData.length,
        totalPages: Math.ceil(filteredData.length / pageSize),
        currentPage: page,
      };
    } catch (error: any) {
      console.log(error.name)
      console.log(error.message)
      throw error;
    }
  }

  public static async authorBookPipeline(
    id: number,
    page: number,
    pageSize: number,
    searchQuery: string,
    sortBy: string,
    sortOrder: string
  ) {
    try {
      const offset = (page - 1) * pageSize;
      const book = await Book.findAll({ where: { author: id } });
      if (!book) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      const bookData = await Book.findAll({
        where: { author: id },
        attributes: ["Bookname", "ISBN", "description", "price"],
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: Category,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
      });
      const processedBooks = bookData.map((book) => ({
        Bookname: book.Bookname,
        ISBN: book.ISBN,
        description: book.description,
        price: book.price,
        author: book.User.username,
        categories:
          book.Categories.map(
            (category: { name: string }) => category.name
          ).join(", ") || "No Categories",
      }));

      const filteredData = PaginationBuilder.searchingItems(
        processedBooks,
        searchQuery
      );
      const sortedData = PaginationBuilder.sortingItems(
        filteredData,
        sortBy,
        sortOrder
      );
      const paginatedData = PaginationBuilder.paginateItems(
        sortedData,
        offset,
        pageSize
      );

      return {
        data: paginatedData,
        totalBooks: filteredData.length,
        totalPages: Math.ceil(filteredData.length / pageSize),
        currentPage: page,
      };
    } catch (error: any) {
      throw error;
    }
  }
}
