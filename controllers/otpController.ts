import asyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import CryptoJS from "crypto-js";

import {
  AddMinutesToDate,
  dates,
  generateOTP,
} from "../config/helperFunctions";
import { Otp, OtpAttributes } from "../models/otpModel";
import { User } from "../models/userModel";

export const sendOtp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email not provided");
    }

    const user_instance = await User.findOne({ where: { email: email } });
    if (!user_instance) {
      res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 10);

    const otpObj: OtpAttributes = {
      otp: otp,
      expiration_time: expiration_time,
    };

    // Create Otp instance in the DB
    const otp_instance = await Otp.create(otpObj);

    // Create details obj containing the email and the otp id
    const details = {
      timestamp: now,
      check: email,
      success: true,
      message: "Otp sent to user",
      otp_id: otp_instance.id,
    };

    const encoded = CryptoJS.AES.encrypt(
      JSON.stringify(details),
      process.env.CRYPTO_SECRET as string
    ).toString();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.SEND_EMAIL_FROM,
        pass: process.env.SEND_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.SEND_EMAIL_FROM,
      to: email,
      subject: "Account Verification OTP",
      text: `Your OTP for account verification is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (err, result) => {
      if (err) {
        return res.send({
          message: "Failure",
          details: err,
        });
      } else {
        return res.send({
          message: "Otp sent successfully",
          details: encoded,
        });
      }
    });
  }
);

export const verifyOtp = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const currentDateTime = new Date();
    const { otp, verification_key, check } = req.body;
    const user_instance = await User.findOne({
      where: { email: check },
    });
    if (user_instance && user_instance?.isVerified) {
      res.status(400).json({ message: "User already verified" });
    }
    if (!otp) {
      res.status(400);
      throw new Error("Otp not provided");
    }

    if (!check) {
      res.status(400);
      throw new Error("Check not provided");
    }

    if (!verification_key) {
      res.status(400);
      throw new Error("Verification key not provided");
    }
    try {
      const decoded = CryptoJS.AES.decrypt(
        verification_key,
        process.env.CRYPTO_SECRET as string
      ).toString(CryptoJS.enc.Utf8);

      console.log(decoded);

      const parsedObj = JSON.parse(decoded);
      if (parsedObj.check !== check) {
        res.status(400).json({ message: "OTP was not sent to this email" });
      }

      const otp_instance = await Otp.findOne({
        where: { id: parsedObj.otp_id },
      });

      if (otp_instance !== null) {
        if (otp_instance.verified !== true) {
          if (
            dates.compare(otp_instance.expiration_time, currentDateTime) == 1
          ) {
            if (otp === otp_instance.otp) {
              otp_instance.verified = true;
              otp_instance.save();
              const user_instance = await User.findOne({
                where: { email: check },
              });
              if (user_instance) {
                user_instance.isVerified = true;
                user_instance.save();
              } else {
                res.status(400).json({ messaag: "User not found" });
              }
              res.status(200).json({ message: "Email verified successfully" });
            } else {
              res.status(400).json({ message: "OTP NOT Matched" });
            }
          } else {
            res.status(400).json({ message: "OTP Expired" });
          }
        } else {
          res.status(400).json({ message: "OTP Already Used" });
        }
      } else {
        const response = { Status: "Failure", Details: "Bad Request" };
        res.status(400).send(response);
      }
    } catch (error: any) {
      const response = { Status: "Failure", Details: error.message };
      res.status(400).send(response);
    }
  }
);
