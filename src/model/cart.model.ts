import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/imports";
import { User } from "../model/imports";
import { CartAttributes, CartCreationAttributes } from "../interfaces/imports";

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
    },
  },
  {
    sequelize,
    modelName: "Cart",
  }
);


Cart.belongsTo(User, { foreignKey: "userId" });
export default Cart;