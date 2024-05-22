import { Role } from "../enum/imports";
import { User, Book, BookCategory, Category } from "../model/imports";
import { Op, where } from "sequelize";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";

export default class AdminPipeline {
  public static async requestPipeline(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    try {
      let queryOptions: any = {
        offset: (page - 1) * pageSize,
        limit: pageSize,
        attributes: ["username", "email", "role", "isApproved"],
        where: {
          isApproved: false,
          role: {
            [Op.in]: [Role.Admin, Role.Author],
          },
        },
      };
      if (searchQuery) {
        queryOptions.where = {
          ...queryOptions.where,
          [Op.or]: [
            { username: { [Op.iLike]: `%${searchQuery}%` } },
            { email: { [Op.iLike]: `%${searchQuery}%` } },
          ],
        };
      }
      if (sortBy) {
        const orderDirection = sortBy.startsWith("-") ? "DESC" : "ASC";
        const attributeName = sortBy.replace(/^-/, "");
        queryOptions.order = [[attributeName, orderDirection]];
      }
      const pendingRequests = await User.findAll(queryOptions);
      console.log(pendingRequests);
      return pendingRequests;
    } catch (error: any) {
      throw error;
    }
  }

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
      const categoryIds = await BookCategory.findAll({
        where: { BookId: id },
        attributes: ["CategoryId"],
      });
      const Ids = categoryIds.map((id) => (id as any).CategoryId);
      const categories = await Category.findAll({
        where: { id: Ids },
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
}
