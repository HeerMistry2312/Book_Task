import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
 import { Book, Category } from "./imports";


class BookCategory extends Model {}

BookCategory.init(
  {
    BookId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "id",
      },
      onDelete: 'CASCASDE'
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
      onDelete: 'CASCASDE'
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
