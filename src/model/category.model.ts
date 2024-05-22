import { DataTypes,Model } from 'sequelize';
import {sequelize} from '../config/imports'
import { CategoryAttributes,CategoryCreationAttributes } from '../interfaces/imports';
import {Book, BookCategory} from './imports'
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: number;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}


Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            validate: {
                notNull: {
                    msg: 'Category Name is required'
                },
                len: {
                    args: [3, 20],
                    msg: 'Category Name must be between 3 and 20 characters'
                }
            }

        },

    },
    {
        sequelize,
        tableName: 'Category',
        timestamps: true,
    }
);

export default Category;