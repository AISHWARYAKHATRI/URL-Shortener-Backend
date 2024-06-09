import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

import { generateOTP, generateToken } from '../config/helperFunctions';
import { UserAttributes } from '../models/userModel';
import db from '../models';

const User = db.user;

// resgister user
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, password } = req.body as UserAttributes;

    if (!firstName || !lastName || !email || !password) {
      res.status(400);
      throw new Error('Please enter all details');
    }

    const userExists = await User.findOne({ where: { email: email } });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
    }

    const newUser: UserAttributes = {
      firstName,
      lastName,
      email,
      password,
    };

    const user = await User.create(newUser);
    sendOtp(email);
    res.status(200).json({ message: 'Registration successfull' });
  }
);

// login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
  }
  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    res.status(404).json({ message: 'User not found' });
  }

  if (!user.isVerified) {
    sendOtp(user.email);
    res.status(403).json({ message: 'Please verify your account' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    res.status(401).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({
    message: 'Login successful',
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user.id),
    },
  });
});

const sendOtp = async (email: string) => {
  const transporter = await nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.SEND_EMAIL_FROM,
      pass: process.env.SEND_EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.SEND_EMAIL_FROM,
    to: email,
    subject: 'Account Verification OTP',
    text: `Your OTP for account verification is: ${generateOTP()}`,
  };
  transporter.sendMail(mailOptions, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
};
