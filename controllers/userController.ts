import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

import { generateToken } from "../config/helperFunctions";
import { UserAttributes } from "../models/userModel";
import db from "../models";

const User = db.user;

// resgister user
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body as UserAttributes;

    if (!firstName || !lastName || !email || !password) {
      res.status(400);
      throw new Error("Please enter all details");
    }

    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
    }

    const newUser: UserAttributes = {
      firstName,
      lastName,
      email,
      password,
    };

    const user = await User.create(newUser);
    res
      .status(200)
      .json({ message: "Registration successfull", email: user.email });
  }
);

// login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (!user.isVerified) {
    res.status(403).json({ message: "Please verify your account" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.id),
    },
  });
});
