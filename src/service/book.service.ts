import Book from "../model/book.model";
import User from "../model/user.model";
import { Role } from "../interfaces/user.interface";
import { AppError } from "../utils/customErrorHandler";
import Category from "../model/category.model";
import { Types } from "mongoose";
import StatusConstants from "../constant/status.constant";
export class BookService {
  public static async showBook(
    id: string,
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<Object> {
    const pipeline: any[] = [];
    pipeline.push(
      {
        $match: {
          title: id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: "$author.username",
          categories: 1,
          description: 1,
          price: 1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          category: "$categories.name",
          description: 1,
          price: 1,
        },
      }
    );

    if (searchQuery) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { author: { $regex: searchQuery, $options: "i" } },
            { category: { $regex: searchQuery, $options: "i" } },
          ],
        },
      });
    }

    if (sortBy) {
      const sortField = sortBy.startsWith("-") ? sortBy.substring(1) : sortBy;
      const sortOrder = sortBy.startsWith("-") ? -1 : 1;
      const sortStage = { $sort: { [sortField]: sortOrder } };
      pipeline.push(sortStage);
    }

    pipeline.push({ $skip: (page - 1) * pageSize }, { $limit: pageSize });
    const books = await Book.aggregate(pipeline);
    const totalCount = await Book.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      books: books,
      totalBooks: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }

  public static async showAllBooks(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<Object> {
    const pipeline: any[] = [];
    pipeline.push(
      {
        $match: {},
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: "$author.username",
          categories: 1,
          description: 1,
          price: 1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categories",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          category: "$categories.name",
          description: 1,
          price: 1,
        },
      }
    );

    if (searchQuery) {
      pipeline.push({
        $match: {
          $or: [
            { title: { $regex: searchQuery, $options: "i" } },
            { author: { $regex: searchQuery, $options: "i" } },
            { category: { $regex: searchQuery, $options: "i" } },
          ],
        },
      });
    }

    if (sortBy) {
      const sortField = sortBy.startsWith("-") ? sortBy.substring(1) : sortBy;
      const sortOrder = sortBy.startsWith("-") ? -1 : 1;
      const sortStage = { $sort: { [sortField]: sortOrder } };
      pipeline.push(sortStage);
    }

    pipeline.push({ $skip: (page - 1) * pageSize }, { $limit: pageSize });
    const books = await Book.aggregate(pipeline);
    const totalCount = await Book.countDocuments();
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      books: books,
      totalBooks: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }

}