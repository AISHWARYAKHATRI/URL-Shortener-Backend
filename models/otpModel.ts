import { DataTypes, Model, Sequelize } from "sequelize";

export interface OtpAttributes {
  id?: number;
  otp: string;
  expiration_time: Date;
  verified?: boolean;
}

export class Otp extends Model<OtpAttributes> implements OtpAttributes {
  public id!: number;
  public otp!: string;
  public expiration_time!: Date;
  public verified!: boolean;
}

export const OtpModel = (sequelize: Sequelize): typeof Otp => {
  Otp.init(
    {
      otp: {
        type: DataTypes.STRING,
      },
      expiration_time: {
        type: DataTypes.DATE,
      },
      verified: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      tableName: "otp",
      timestamps: true,
    }
  );
  return Otp;
};
