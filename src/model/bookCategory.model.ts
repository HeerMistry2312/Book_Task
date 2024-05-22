import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";

class BookCategory extends Model {}

BookCategory.init(
  {
    BookId: {
      type: DataTypes.INTEGER,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "BookCategory",
  }
);

export default BookCategory;
