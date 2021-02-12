import { Schema, model, Document } from "mongoose";

type reactionType = "smile" | "angry" | "surprise" | "love" | "hate";

interface StorieContent {
  mediaType: string;
  mediaUrl: string;
  duration: number;
}

export interface IStorie extends Document {
  creator: {
    name: string;
    _id: string;
    profilePic: string;
  };
  content: StorieContent[];
  status: "active" | "suspended" | "deleted";
  comments?: string[];
  reactions?: [{ userId: string; username: string; instance: reactionType }];
  likes?: Array<{ userId: string; username: string }>;
}

const storieSchema = new Schema(
  {
    creator: {
      name: String,
      _id: Schema.Types.ObjectId,
      profilePic: String,
    },
    content: [
      {
        mediaType: String,
        mediaUrl: String,
        duration: Number,
      },
    ],
    status: {
      type: String,
      default: "active",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    reactions: [
      {
        userId: Schema.Types.ObjectId,
        username: String,
        instance: String,
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

export default model<IStorie>("Storie", storieSchema, "stories");
