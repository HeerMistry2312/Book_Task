import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
// import { Book, Category } from "./imports";
import Book from "./book.model";
import Category from "./category.model";

class BookCategory extends Model {}

BookCategory.init(
  {
    BookId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "id",
      },
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "BookCategory",
  }
);
BookCategory.belongsTo(Category, { foreignKey: 'CategoryId' });
Category.hasMany(BookCategory, { foreignKey: 'CategoryId' });

export default BookCategory;
