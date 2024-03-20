import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import twilio from "twilio";
import dotenv from "dotenv";
import * as readline from "node:readline/promises";
dotenv.config();

//local modules
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const verifyCode = async (req, res, next) => {
  const { phone_number } = req.body;

  try {
    if (!phone_number) {
      return next(errorHandler(400, "phone number is required"));
    }

    if (phone_number.length > 10) {
      return next(
        errorHandler(400, "phone number length should be 10 characters")
      );
    }

    let user = await User.findOne({ phone_number: phone_number });

    if (!user) {
      user = new User({
        phone_number: phone_number,
        priority: null,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    await user.save();

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      })
      .json(user);
  } catch (error) {
    next(error);
  }
};
