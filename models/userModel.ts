import { Model, DataTypes, Sequelize } from "sequelize";
import bcrypt from "bcrypt";

export interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  isVerified?: boolean;
  password: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public isVerified!: boolean;
  public password!: string;
}

export const UserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      hooks: {
        beforeCreate: async (user: User) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        },
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
          }
        },
      },
    }
  );

  return User;
};
