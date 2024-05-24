import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
import { User, Category, Cart, BookCart} from "../model/imports";
import { BookAttributes, BookCreationAttributes } from "../interfaces/imports";
import BookCategory from "../model/bookCategory.model";
class Book
  extends Model<BookAttributes, BookCreationAttributes>
  implements BookAttributes
{
  public id!: number;
  public Bookname!: string;
  public author!: number;
  public ISBN!: number;
  public description!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  User: any;
  Categories: any;
}
Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Bookname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: "Book name is required",
        },
        len: {
          args: [3, 20],
          msg: "Username must be between 3 and 20 characters",
        },
      },
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "author name is required",
        },
      },
      references: {
        model: User,
        key: "id",
      },
    },
    ISBN: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique:true,
      validate: {
        notNull: {
          msg: "ISBN is required",
        },
        len: {
          args: [10, 10],
          msg: "ISBN must be 10 numbers",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "description is required",
        },
        len: {
          args: [3, 100],
          msg: "description must be between 3 and 100 characters",
        },
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "price is required",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Book",
  }
);
Book.belongsTo(User, { foreignKey: "author" });


Book.belongsToMany(Category,{through: BookCategory})
Category.belongsToMany(Book,{through: BookCategory})

export default Book;
