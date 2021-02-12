import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// interface IDecodedToken {
//   email: string;
//   userId: string;
//   username: string;
// }

export interface IPayload {
  _id: string;
  name: string;
  email: string;
  iat: number;
}

const isAuthHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      const error = new Error("Not authenticated first intent.");
      throw error;
    }
    const token = authHeader.split(" ")[1];
    let payload: IPayload;

    try {
      payload = jwt.verify(token, process.env.JWT_WORD!) as IPayload;
      res.locals.userId = payload._id;
    } catch (err) {
      err.statusCode = 500;
      throw err;
    }
    if (!payload) {
      const error = new Error("Not authenticated.");
      throw error;
    }

    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }

  // let decodedToken;

  // //@ts-ignore
  // req.body.userId = decodedToken.userId;
  // next();
};

export default isAuthHandler;
