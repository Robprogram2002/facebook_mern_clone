import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User";
import { CustomError } from "./controllerTypes";

export const singUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const name: string = req.body.userName;
  const password = req.body.password;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: CustomError = {
        name: "SignUp error",
        messages: errors,
        status: 201,
      };
      throw error;
    }

    const hashedPw: string = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email,
      password: hashedPw,
      userName: name,
      user_type: "user",
      posts: [],
      followers: [],
      follows: [],
      friends: [],
      friendRequests: {},
      albums: [],
      favorites: [],
      notifications: {},
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
    console.log(result);
  } catch (error) {
    next(error);
  }
};

export const signInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email: string = req.body.email;
  const password: string = req.body.password;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error: CustomError = {
        name: "SignIn error",
        messages: errors,
        status: 201,
      };
      console.log(errors);
      throw error;
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      const error: CustomError = {
        name: "SignIn error",
        messages: {
          errors: [
            {
              value: email,
              msg: "User not foun with this email",
              param: "email",
            },
          ],
        },
        status: 201,
      };
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error: CustomError = {
        name: "SignIn error",
        messages: {
          errors: [
            {
              value: password,
              msg: "Incorrect password",
              param: "password",
            },
          ],
        },
        status: 201,
      };
      throw error;
    }

    const word = process.env.JWT_WORD!;
    // Create a Token
    const token: string = jwt.sign(
      { _id: user._id, email: user.email, name: user.userName },
      word,
      {
        expiresIn: "2h",
      }
    );
    res.header("auth-token", token).json({
      token,
      user: {
        _id: user.id,
        name: user.userName,
        perfil: user.profile?.imageProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};
