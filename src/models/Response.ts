import { Schema, Document, model } from "mongoose";
import { Like, LikeSchema } from "./modelTypes";

interface IResponse extends Document {
  author: {
    userId: string;
    username: string;
    profilePic: string;
  };
  contentText?: string;
  contentImage?: string;
  likes: Map<string, Like>;
}

const ResponseSchema = new Schema(
  {
    author: {
      // type: Schema.Types.ObjectId,
      // ref: "User",
      userId: Schema.Types.ObjectId,
      username: String,
      profilePic: String,
    },
    contentText: String,
    contentImage: String,
    likes: {
      type: Map,
      of: LikeSchema,
    },
  },
  { timestamps: true }
);

export default model<IResponse>("Response", ResponseSchema, "responses");
