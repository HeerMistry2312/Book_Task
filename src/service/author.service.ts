import User from "../model/user.model";
import { Role } from "../interfaces/user.interface";
import { AppError } from "../utils/customErrorHandler";
import Book from "../model/book.model";
import Category from "../model/category.model";
import { BookInterface } from "../interfaces/book.interface";
import StatusConstants from "../constant/status.constant";
import { Types } from "mongoose";
export class AuthorService {
  public static async createBook(
    author: string,
    data: BookInterface
  ): Promise<object> {
    const { title, categories, description, price } = data;
    const authid = await User.findById({ _id: author });
    if (!authid) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const id: Types.ObjectId = authid!._id;

    const fetchid = await Category.find({ name: { $in: [...categories] } });
    const categoriesID = fetchid.map((i) => i._id);
    const newCategoriesIds = categoriesID;

    let book = new Book({
      title,
      author: id,
      categories: newCategoriesIds,
      description,
      price,
    });
    let newBook = await book.save();
    const bookPipeline = [
      {
        $match: { _id: newBook._id },
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
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $project: {
          _id: 0,
          title: 1,
          author: 1,
          categories: 1,
          description: 1,
          price: 1,
        },
      },
    ];
    const bookResult = await Book.aggregate(bookPipeline);

    return { message: "Book Created", data: bookResult };
  }

  public static async updateBook(
    author: string,
    id: string,
    body: BookInterface
  ): Promise<object | null> {
    let book = await Book.findOne({ title: id });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (book.author.toString() !== author) {
      throw new AppError(
        StatusConstants.BAD_REQUEST.body.message,
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }
    const updateData = { ...body };

    if (body.categories) {
      const fetchid = await Category.find({
        name: { $in: [...updateData.categories] },
      });
      const categoriesID = fetchid.map((i) => i._id);
      updateData.categories = categoriesID;
    }

    const bookPipeline = [
      {
        $match: { _id: book._id },
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
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      {
        $project: {
          _id: 0,
          title: 1,
          author: "$author.username",
          categories: "$categoryDetails.name",
          description: 1,
          price: 1,
        },
      },
    ];

    await Book.findByIdAndUpdate(
      book._id,
      {
        updateData,
      },
      { new: true }
    );
    const bookResult = await Book.aggregate(bookPipeline);
    return { message: "Book Updated", data: bookResult };
  }

  public static async deleteBook(
    author: string,
    id: string
  ): Promise<object | null> {
    let book = await Book.findOne({ title: id, author: author });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    if (book.author.toString() !== author) {
      throw new AppError(
        StatusConstants.BAD_REQUEST.body.message,
        StatusConstants.BAD_REQUEST.httpStatusCode
      );
    }
    const bookPipeline = [
      {
        $match: { _id: book._id },
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
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      {
        $project: {
          _id: 0,
          title: 1,
          author: "$author.username",
          categories: "$categoryDetails.name",
          description: 1,
          price: 1,
        },
      },
    ];
    const bookResult = await Book.aggregate(bookPipeline);
    book = await Book.findByIdAndDelete(book._id);

    return { message: "Book Deleted", deletedData: bookResult };
  }

  public static async showMyBooks(
    author: string,
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {
    const bookPipeline: any[] = [];
    bookPipeline.push(
      {
        $match: { author: author },
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
        $lookup: {
          from: "categories",
          localField: "categories",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      {
        $project: {
          _id: 0,
          title: 1,
          author: "$author.username",
          categories: "$categoryDetails.name",
          description: 1,
          price: 1,
        },
      }
    );
    if (searchQuery) {
      bookPipeline.push({
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
      bookPipeline.push(sortStage);
    }

    bookPipeline.push({ $skip: (page - 1) * pageSize }, { $limit: pageSize });
    const books = await Book.aggregate(bookPipeline);
    const totalCount = await Book.countDocuments({author: author});
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      books: books,
      totalBooks: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }

  public static async showBook(
    author_id: string,
    name: string
  ): Promise<object | null> {
    let seekauthor = await User.findOne({ _id: author_id, role: Role.Author });
    if (!seekauthor) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const book = await Book.find({ author: seekauthor._id, title: name })
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });
    if (!book) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    return book;
  }
}
