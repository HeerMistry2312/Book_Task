import { AppError } from "../utils/customErrorHandler";
import User from "../model/user.model";
import { Role } from "../interfaces/user.interface"
import Book from "../model/book.model";
import { Types } from "mongoose";
import Category from "../model/category.model";
import { BookInterface } from "../interfaces/book.interface";
import { CategoryInterface } from "../interfaces/category.interface";
import StatusConstants from "../constant/status.constant";
export class AdminService {
  public static async approveAuthor(id: string): Promise<object> {
    let user = await User.findById(id);
    if (!user) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    if (user.role !== Role.Author) {
      throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
    }
    return { data: user };
  }

  public static async approveAdmin(id: string): Promise<object> {
    let user = await User.findByIdAndUpdate(id, { isApproved: true });
    if (!user) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    if (user.role !== Role.Admin) {
      throw new AppError(StatusConstants.UNAUTHORIZED.body.message,StatusConstants.UNAUTHORIZED.httpStatusCode);
    }
    return { data: user };
  }

  public static async createBook(data: BookInterface): Promise<object> {
    const { title, author, categories, description, price } = data;
    const authid = await User.findOne({ username: author });
    if (!authid) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    const id: Types.ObjectId = authid!._id;

    const fetchid = await Category.find({name:{$in:[...categories]}})
      const categoriesID = fetchid.map(i => i._id)
      const newCategoriesIds = categoriesID

    let book = new Book({
      title,
      author: id,
      categories: newCategoriesIds,
      description,
      price,
    });
    let newBook = await book.save();
    const bookPipeline= [
      {
          $match: {_id: newBook._id}
      },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author"
          }
        },

         {
          $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "categoryDetails"
          }
        },

        {
          $project:{
              _id: 0,
              title: 1,
              author: "$author.username",
              categories: "$categoryDetails.name",
              description:1,
              price:1

          }
        }

  ]
  const bookResult = await Book.aggregate(bookPipeline)
    return { message: "Book Created", data: bookResult };
  }

  public static async updateBook(
    id: string,
    body: BookInterface
  ): Promise<object> {
    const { title, author, categories, description, price } = body;
    let authid1: Types.ObjectId | undefined;
    let book = await Book.findOne({ title: id });
    if (!book) {
      throw new AppError(StatusConstants.NOT_FOUND.body.message,StatusConstants.NOT_FOUND.httpStatusCode);
    }
    if (author !== undefined) {
      const authid = await User.findOne({ username: author });
      authid1 = authid!._id;
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

  public static async deleteBook(id: string): Promise<object> {
    const deletebook = await Book.findOne({ title: id });
    if (!deletebook) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    const bookId: Types.ObjectId = deletebook._id;
    const bookPipeline = [
      {
        $match: { _id: bookId },
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
     await Book.findByIdAndDelete({ _id: bookId })
        return { message: "Delete Success", data: bookResult };
  }




  public static async listofPendingReq(
    page: number,
    pageSize: number,
    searchQuery?: string,
    sortBy?: string
  ): Promise<object> {

    const pipeline: any[] = [];
    pipeline.push({$match:{isApproved: false}},
    {
      $project:{
        _id: 0,
        username: 1,
        email: 1,
        role: 1,
        isApproved: 1
      }
    }
    )
    if (searchQuery) {
      pipeline.push({
        $match: {
          $or: [
            { username: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { role: { $regex: searchQuery, $options: "i" } },
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

    const user = await User.aggregate(pipeline);
    const totalCount = await Book.countDocuments({isApproved: false});
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
     users: user,
      totalUsers: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }
}
