import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
import { Book,Cart, User } from "./imports";

class BookCart extends Model {
    Quantity!: number;
    TotalPrice!: number;
}

BookCart.init(
  {
    CartId: {
      type: DataTypes.INTEGER,
      references: {
        model: Cart,
        key: "id",
      },
      onDelete: 'CASCASDE'
    },
    BookId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "id",
      },
    },
    Quantity:{
        type: DataTypes.INTEGER,
    },
    TotalPrice:{
        type: DataTypes.FLOAT,
    },
  },
  {
    sequelize,
    modelName: "BookCart",
  }
);
Book.belongsToMany(Cart, { through: BookCart });
Cart.belongsToMany(Book, { through: BookCart });


export default BookCart;
