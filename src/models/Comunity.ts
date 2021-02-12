import { Schema, model, Document } from "mongoose";

export interface IComunity extends Document {
  creator: string;
  name: string;
  description: string;
  banner: string;
  status: "active" | "suspended" | "deleted";
  information: any;
  settings: any;
  users: string[];
  posts: string[];
}

const postSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    banner: String,
    status: {
      type: String,
      default: "active",
    },
    information: {},
    settings: {},
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

export default model<IComunity>("Comunity", postSchema, "comunities");
