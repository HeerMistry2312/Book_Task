import StatusConstants from "../constant/status.constant";
import { Book, Cart, Category, BookCategory, BookCart } from "../model/imports";
import { AppError } from "../utils/imports";
import { CartPipeline } from "../query/imports";
import { sequelize } from "../config/imports";

export class CartService {
  public static async goToCart(id: number): Promise<object> {
    const cart = await Cart.findOne({ where: { userId: id } });
    const result = await CartPipeline.getCartDetails(cart!.id);
    if (!cart) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }

    return result;
  }

  public static async addToCart(
    id: number,
    bookName: string,
    quantity: number
  ): Promise<object> {
    const transaction = await sequelize.transaction();
    try {
      let cart = await Cart.findOne({ where: { userId: id }, transaction });
      if (!cart) {
        cart = await Cart.create({ userId: id }, { transaction });
      }
      let book = await Book.findOne({
        where: { Bookname: bookName },
        transaction,
      });
      if (!book) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      const totalPrice = quantity * book.price;

      let bookCartEntry = await BookCart.findOne({
        where: { CartId: cart.id, BookId: book.id },
        transaction,
      });

      if (bookCartEntry) {
        bookCartEntry.Quantity += quantity;
        bookCartEntry.TotalPrice += totalPrice;
        await bookCartEntry.save({ transaction });
      } else {
        bookCartEntry = await BookCart.create(
          {
            CartId: cart.id,
            BookId: book.id,
            Quantity: quantity,
            TotalPrice: totalPrice,
          },
          { transaction }
        );
      }

      const totalAmount = await BookCart.sum("TotalPrice", {
        where: { CartId: cart.id },
        transaction,
      });
      await cart.update({ totalAmount }, { transaction });
      const result = await CartPipeline.getCartDetails(cart.id);
      await transaction.commit();
      return { message: "added to cart", data: result };
    } catch (error: any) {
      await transaction.rollback();
      throw error;
    }
  }

  public static async decrementBook(
    id: number,
    bookName: string,
    quantity: number
  ): Promise<object | undefined> {
    const transaction = await sequelize.transaction();
    try {
      let cart = await Cart.findOne({ where: { userId: id }, transaction });
      if (!cart) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      let book = await Book.findOne({
        where: { Bookname: bookName },
        transaction,
      });
      if (!book) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      let bookCartEntry = await BookCart.findOne({
        where: { CartId: cart.id, BookId: book.id },
        transaction,
      });

      if (!bookCartEntry) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      if (bookCartEntry.Quantity >= quantity) {
        bookCartEntry.Quantity -= quantity;
        bookCartEntry.TotalPrice -= quantity * book.price;
      } else {
        throw new AppError(
          StatusConstants.BAD_REQUEST.body.message,
          StatusConstants.BAD_REQUEST.httpStatusCode
        );
      }
      const totalAmount = await BookCart.sum("TotalPrice", {
        where: { CartId: cart.id },
        transaction,
      });
      await cart.update({ totalAmount }, { transaction });

      await bookCartEntry.save({ transaction });

      const result = await CartPipeline.getCartDetails(cart.id);
      await transaction.commit();
      return { message: "decremented to cart", data: result };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public static async removeBook(
    id: number,
    bookName: string
  ): Promise<object | undefined> {
    const transaction = await sequelize.transaction();
    try {
      let cart = await Cart.findOne({ where: { userId: id }, transaction });
      if (!cart) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      let book = await Book.findOne({
        where: { Bookname: bookName },
        transaction,
      });
      if (!book) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      let bookCartEntry = await BookCart.findOne({
        where: { CartId: cart.id, BookId: book.id },
        transaction,
      });

      if (!bookCartEntry) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      const deleteBook = await BookCart.destroy({ where: { BookId: book.id } });
      const totalAmount = await BookCart.sum("TotalPrice", {
        where: { CartId: cart.id },
        transaction,
      });
      await cart.update({ totalAmount }, { transaction });

      const result = await CartPipeline.getCartDetails(cart.id);
      await transaction.commit();
      return { message: "remove from cart", data: result };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public static async emptyCart(id: number): Promise<object | undefined> {
    const transaction = await sequelize.transaction();
    try {
      let cart = await Cart.findOne({ where: { userId: id }, transaction });
      if (!cart) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }
      const result = await CartPipeline.getCartDetails(cart.id);
      await Cart.destroy({ where: { id: cart.id } });

      await transaction.commit();
      return { message: "deleted cart", data: result };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
