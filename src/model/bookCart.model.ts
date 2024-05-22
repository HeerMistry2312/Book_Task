import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
import { Book,Cart } from "./imports";

class BookCart extends Model {}

BookCart.init(
  {
    CartId: {
      type: DataTypes.INTEGER,
    },
    BookId: {
      type: DataTypes.INTEGER,
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
BookCart.belongsTo(Cart, { foreignKey: 'CartId' });
Cart.hasMany(BookCart, { foreignKey: 'CategoryId' });
export default BookCart;
