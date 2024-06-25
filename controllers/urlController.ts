import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

export const shortenUrl = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { longUrl, customBackHalf, title, generateQRCode } = req.body;
    if (!longUrl) {
      res.status(400).json({ messag: "Url is required." });
    }
  }
);
