import { Sequelize, DataTypes } from "sequelize";
import { UserModel } from "./userModel";
import { OtpModel } from "./otpModel";
require("dotenv").config();

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB as string,
  process.env.USER as string,
  process.env.PASSWORD as string,
  {
    host: process.env.HOST as string,
    dialect: "mysql",
  }
);

// Authenticate with the database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });

// Define the database object
const db: any = {}; // You might want to define more precise types for db

// Assign the Sequelize instance to db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import and initialize the userModel
db.user = UserModel(sequelize);
db.otp = OtpModel(sequelize);

export default db;
