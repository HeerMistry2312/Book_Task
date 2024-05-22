import { AppError } from "../utils/imports";
import { Role } from "../enum/imports";
import { Category, User, Book, BookCategory } from "../model/imports";
import StatusConstants from "../constant/status.constant";
import { UserPipeline, AdminPipeline } from "../query/imports";
import { Op } from "sequelize";

export class AdminService {
  public static async approveAuthor(name: string): Promise<object> {
    const user = await User.findOne({ where: { username: name } });
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (user.role !== Role.Author) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    const approveAuthor = await user.update({ isApproved: true });
    const result = await UserPipeline.userPipeline(approveAuthor.id);
    return { data: result };
  }

  public static async approveAdmin(name: string): Promise<object> {
    const user = await User.findOne({ where: { username: name } });
    if (!user) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (user.role !== Role.Author) {
      throw new AppError(
        StatusConstants.UNAUTHORIZED.body.message,
        StatusConstants.UNAUTHORIZED.httpStatusCode
      );
    }
    const approveAdmin = await user.update({ isApproved: true });
    const result = await UserPipeline.userPipeline(approveAdmin.id);
    return { data: result };
  }

  public static async listofPendingReq(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const user = await AdminPipeline.requestPipeline(
      page,
      pageSize,
      searchQuery,
      sortBy
    );
    const totalCount = (
      await User.findAndCountAll({
        where: {
          isApproved: false,
          role: {
            [Op.in]: [Role.Admin, Role.Author],
          },
        },
      })
    ).count;
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      users: user,
      totalUsers: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }

  public static async createBook(
    title: string,
    author: string,
    isbn: number,
    categories: string[],
    description: string,
    price: number
  ): Promise<object> {
    const authid = await User.findOne({ where: { username: author } });
    if (!authid) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const id: number = authid.id;
    const book = await Book.create({
      Bookname: title,
      author: id,
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

    const result = await AdminPipeline.bookDetailPipeline(book.id);
    return { message: "Book Created", data: result };
  }

  public static async updateBook(
    id: string,
    title?: string,
    author?: string,
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
    if (author !== undefined) {
      const findAuthor = await User.findOne({ where: { username: author } });
      if (!findAuthor) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      book.author = findAuthor.id;
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

    const result = await AdminPipeline.bookDetailPipeline(updateBook.id);
    return { message: "Book Updated", data: result };
  }

  public static async deleteBook(id: string): Promise<object> {
    const deletebook = await Book.findOne({ where: { Bookname: id } });
    if (!deletebook) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const result = await AdminPipeline.bookDetailPipeline(deletebook.id);
    await BookCategory.destroy({ where: { BookId: deletebook.id } });
    await Book.destroy({ where: { id: deletebook.id } });
    return { message: "Delete Success", data: result };
  }
}
