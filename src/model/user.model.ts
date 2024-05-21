import { DataTypes,Model } from 'sequelize';
import {sequelize} from '../config/imports'
import { Role } from '../enum/imports';
import { UserAttributes,UserCreationAttributes } from '../interfaces/imports';
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: Role;
    public isApproved!: boolean;
    public token?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Username is required'
                },
                len: {
                    args: [3, 20],
                    msg: 'Username must be between 3 and 20 characters'
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Email is required'
                },
                isEmail: {
                    msg: 'Invalid email format'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Password is required'
                },
                isAtLeast4Characters(value: string) {
                    if (value.length < 4) {
                        throw new Error('Password must have at least 4 characters');
                    }
                }
            }
        },
        role: {
            type: DataTypes.ENUM(Role.Admin, Role.Author, Role.Customer),
            allowNull: false,
            defaultValue: Role.Customer,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'User',
        timestamps: true,
    }
);

export default User;
