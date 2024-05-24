import {
  User,
  Book,
  BookCategory,
  Category,
  Cart,
  BookCart,
} from "../model/imports";
import { AppError } from "../utils/customErrorHandler";
import StatusConstants from "../constant/status.constant";

export class CartPipeline {
  public static async getCartDetails(cartId: number) {
    try {
      const cart = await Cart.findByPk(cartId);
      if (!cart) {
        throw new AppError(
          StatusConstants.NOT_FOUND.body.message,
          StatusConstants.NOT_FOUND.httpStatusCode
        );
      }

      const userCartData = await Cart.findAll({
        where: { userId: cart.userId },
        include: [
          {
            model: User,
            attributes: ["username", "role", "email"],
          },
          {
            model: Book,
            attributes: ["Bookname", "ISBN"],
            include: [
              {
                model: User,
                attributes: ["username"],
              },
            ],
            through: {
              attributes: ["Quantity", "TotalPrice"],
            },
          },
        ],
      });
      const processedData = userCartData.map(cart => ({

        username: cart.User.username,
        role: cart.User.role,
        email: cart.User.email,
        books: cart.Books.map((book: { Bookname: string; ISBN: number; User: { username: string; }; BookCart: { Quantity: number; TotalPrice: number; }; }) => ({
          Bookname: book.Bookname,
          ISBN: book.ISBN,
          author: book.User.username,
          Quantity: book.BookCart.Quantity,
          TotalPrice: book.BookCart.TotalPrice
        })),
        totalAmount: cart.totalAmount,
      }));

      return processedData
    } catch (error: any) {
      throw error;
    }
  }
}
