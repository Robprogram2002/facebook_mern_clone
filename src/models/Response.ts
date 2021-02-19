import { Schema, Document, model } from "mongoose";
import { Like, LikeSchema, OwnerSchema } from "./modelTypes";

interface IResponse extends Document {
  creator: {
    name: string;
    _id: string;
    profilePic: string;
  };
  contentText?: string;
  contentImage?: string;
  likes: Map<string, Like>;
}

const ResponseSchema = new Schema(
  {
    creator: OwnerSchema,
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
