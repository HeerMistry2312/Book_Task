import { InternalServerError } from "../error/errorHandler";
import User from "../model/user.model";
import { Role } from "../interfaces/user.interface"
import Book from "../model/book.model";
import { Types } from "mongoose";
import Category from "../model/category.model";
import { BookInterface } from "../interfaces/book.interface";
import { CategoryInterface } from "../interfaces/category.interface";

export class AdminService {
  public static async ApproveAuthor(id: string): Promise<object> {
    let user = await User.findByIdAndUpdate(id);
    if (!user) {
      throw new InternalServerError("User not Found");
    }
    if (user.role !== Role.Author) {
      throw new InternalServerError("User Not Register as Author");
    }
    return { data: user };
  }

  public static async ApproveAdmin(id: string): Promise<object> {
    let user = await User.findByIdAndUpdate(id, { isApproved: true });
    if (!user) {
      throw new InternalServerError("User not Found");
    }
    if (user.role !== "admin") {
      throw new InternalServerError("User Not Register as Admin");
    }
    return { data: user };
  }

  public static async CreateBook(data: BookInterface): Promise<object> {
    const { title, author, categories, description, price } = data;
    const authid = await User.findOne({ username: author });
    if (!authid) {
      throw new InternalServerError("Author Not Found");
    }
    const id: Types.ObjectId = authid!._id;
    //const categoryIds: Types.ObjectId[] = [];
    // for (const categoryName of categories) {
    //     let category = await Category.findOne({ name: categoryName });
    //     if (!category) {
    //         category = await Category.create({ name: categoryName });
    //     }
    //     categoryIds.push(category._id);
    // }

    const categoryPromises = categories.map(async (categoryName) => {
      let category = await Category.findOne({ name: categoryName });
      if (!category) {
        category = await Category.create({ name: categoryName });
      }
      return category._id;
    });

    const categoryIds = await Promise.all(categoryPromises);

    let book = new Book({
      title,
      author: id,
      categories: categoryIds,
      description,
      price,
    });
    let newBook = await book.save();
    return { message: "Book Created", data: newBook };
  }

  public static async UpdateBook(
    id: string,
    body: BookInterface
  ): Promise<object> {
    const { title, author, categories, description, price } = body;
    let authid1: Types.ObjectId | undefined;
    let book = await Book.findOne({ title: id });
    if (!book) {
      throw new InternalServerError("Book Not Found");
    }
    if (author !== undefined) {
      const authid = await User.findOne({ username: author });
      authid1 = authid!._id;
    }
    // const categoryIds: Types.ObjectId[] | undefined | CategoryInterface[] = categories !== undefined ? [] : book.categories;
    // if (categories !== undefined) {
    //     for (const categoryName of categories) {
    //         let category = await Category.findOne({ name: categoryName });
    //         if (!category) {
    //             category = await Category.create({ name: categoryName });
    //         }
    //         categoryIds.push(category._id);
    //     }
    // }

    const categoryIds: Types.ObjectId[] | undefined | CategoryInterface[] =
      categories !== undefined ? [] : book.categories;

    if (categories !== undefined) {
      const categoryPromises = categories.map(async (categoryName) => {
        let category = await Category.findOne({ name: categoryName });
        if (!category) {
          category = await Category.create({ name: categoryName });
        }
        return category._id;
      });

      const resolvedCategoryIds = await Promise.all(categoryPromises);
      categoryIds.push(...resolvedCategoryIds);
    }

    let update = await Book.findByIdAndUpdate(
      book._id,
      {
        title,
        author: authid1 || undefined,
        categories: categoryIds || undefined,
        description,
        price,
      },
      { new: true }
    )
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });
    if (!update) {
      throw new InternalServerError("Book Not Found");
    }
    return { message: "Update Success", data: update };
  }

  public static async DeleteBook(id: string): Promise<object> {
    const bookid = await Book.findOne({ title: id });
    const id1: Types.ObjectId = bookid!._id;
    const book = await Book.findByIdAndDelete({ _id: id1 })
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });
    if (!book) {
      throw new InternalServerError("Book Not Found");
    }
    return { message: "Delete Success", data: book };
  }

  public static async listofPendingReq(
    page: number,
    pageSize: number
  ): Promise<object> {
    const totalCount = await User.countDocuments({ isApproved: false });
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page < 1 || page > totalPages) {
      throw new InternalServerError("Invalid page number");
    }
    const skip = (page - 1) * pageSize;
    const user = await User.find({ isApproved: false })
      .skip(skip)
      .limit(pageSize);
    if (!user) {
      throw new InternalServerError("User not Found");
    }
    return {
      pendingRequests: user,
      totalPendingReq: totalCount,
      totalPages: totalPages,
      currentPage: page,
    };
  }
}
