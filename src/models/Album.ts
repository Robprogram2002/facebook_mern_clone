import { Schema, model, Document } from "mongoose";

export interface IAlbum extends Document {
  userId: string;
  title: string;
  description?: string;
  items?: string[];
  comments?: any[];
  likes?: Array<{ userId: string; username: string }>;
  status?: "active" | "suspended" | "deleted";
  cover: string;
}

const albumSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    description: String,
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    cover: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likes: [
      {
        userId: Schema.Types.ObjectId,
        username: String,
      },
    ],
  },
  { timestamps: true }
);

export default model<IAlbum>("Album", albumSchema, "albums");
