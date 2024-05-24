import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
import { BookCart, User } from "../model/imports";
import { BookAttributes, CartAttributes, CartCreationAttributes, UserAttributes } from "../interfaces/imports";

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public userId!: number;
  public totalAmount! : number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  User!: UserAttributes;
  Book!: BookAttributes;
  BookCart!: any;
  Books!: any;
}
Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "User name is required",
        },
      },

      references: {
        model: User,
        key: "id",
      },
      onDelete: 'CASCADE',

    },
    totalAmount:{
      type: DataTypes.FLOAT,

    },

  },
  {
    sequelize,
    modelName: "Cart",
  }
);
Cart.belongsTo(User, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });

export default Cart;