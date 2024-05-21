import { DataTypes,Model } from 'sequelize';
import {sequelize} from '../config/imports'
import {User} from '../model/imports'
import { BookAttributes,BookCreationAttributes } from '../interfaces/imports';
import { log } from 'handlebars';
class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: number;
  public Bookname!: string;
  public author!: number;
  public ISBN!: number;
  public description!: string;
  public price!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Book.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      Bookname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model:User,
            key:'id'
        }
      },
      ISBN: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Book'
    }
  );
  Book.belongsTo(User,{foreignKey:'author'});


  export default Book