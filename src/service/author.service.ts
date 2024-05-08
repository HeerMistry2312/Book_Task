import User from "../model/user.model";
import {  Role } from "../interfaces/user.interface"
import { appError } from "../error/errorHandler";
import Book from "../model/book.model";
import { Types } from "mongoose";
import Category from "../model/category.model";
import { BookInterface } from "../interfaces/book.interface";
import { CategoryInterface } from "../interfaces/category.interface";
export class authorService {
  public static async createBook(
    author: string,
    data: BookInterface
  ): Promise<object> {
    const { title, categories, description, price } = data;
    // const categoryIds: Types.ObjectId[] = [];
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
      title: title,
      author: author,
      categories: categoryIds,
      description: description,
      price: price,
    });
    let newBook = await book.save();
    return { message: "Book Added", data: newBook };
  }

  public static async updateBook(
    author: string,
    id: string,
    body: BookInterface
  ): Promise<object | null> {
    let book = await Book.findOne({ title: id });
    if (!book) {
      throw new appError("Book Not Found",404);
    }
    if (book.author.toString() !== author) {
      throw new appError("You are not authorized to edit this book",401);
    }
    const { title, categories, description, price } = body;
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

    book = await Book.findByIdAndUpdate(
      book._id,
      {
        title: title,
        author: author,
        categories: categoryIds || undefined,
        description: description,
        price: price,
      },
      { new: true }
    )
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });
    return { message: "Book Updated", data: book };
  }

  public static async deleteBook(
    author: string,
    id: string
  ): Promise<object | null> {
    let book = await Book.findOne({ title: id, author: author });
    if (!book) {
      throw new appError("Book Not FOund",404);
    }
    if (book.author.toString() !== author) {
      throw new appError(
        "You are not authorized to delete this book",401
      );
    }
    book = await Book.findByIdAndDelete(book._id)
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });

    return { message: "Book Deleted", deletedData: book };
  }

  public static async showMyBooks(
    author: string,
    page: number,
    pageSize: number
  ): Promise<object> {
    const totalCount = await Book.countDocuments({ author: author });
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page < 1 || page > totalPages) {
      throw new appError("Category Not FOund",404);
    }
    const skip = (page - 1) * pageSize;
    let book = await Book.find({ author: author })
      .skip(skip)
      .limit(pageSize)
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });
    if (!book) {
      throw new appError("Book Not Found",404);
    }
    return {
      books: book,
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
      throw new appError("Author Not Found",404);
    }
    const book = await Book.find({ author: seekauthor._id, title: name })
      .populate({ path: "author", select: ["username", "-_id"] })
      .populate({ path: "categories", select: ["name", "-_id"] });
    if (!book) {
      throw new appError("Book Not Found",404);
    }
    return book;
  }
}
