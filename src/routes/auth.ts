import { Router } from "express";
import { singUpHandler, signInHandler } from "../controllers/authController";
import { body } from "express-validator";
import User from "../models/User";

const route = Router();

route.post(
  "/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      }),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Please enter a password with at least 8 characters"),
    body("userName")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 4 })
      .withMessage("Please enter a valid user name"),
  ],
  singUpHandler
);

route.post(
  "/sign-in",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Please enter a password with at least 8 characters"),
  ],
  signInHandler
);

export default route;
