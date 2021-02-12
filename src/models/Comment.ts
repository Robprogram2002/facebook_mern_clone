import { Schema, Document, model } from "mongoose";
import { LikeSchema, Reaction, ReactionSchema } from "./modelTypes";

export interface IComment extends Document {
  author: {
    userId: string;
    username: string;
    profilePic: string;
  };
  contentText?: string;
  contentImage?: string;
  likes: Map<string, { username: string }>;
  reactions: Map<string, Reaction>;
  responses: string[];
}

const commentSchema = new Schema(
  {
    author: {
      // type: Schema.Types.ObjectId,
      // ref: "User",
      userId: Schema.Types.ObjectId,
      username: String,
      profilePic: String,
    },
    contentText: {
      type: String,
      default: null,
    },
    contentImage: {
      type: String,
      default: null,
    },
    likes: {
      type: Map,
      of: LikeSchema,
    },
    responses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Response",
      },
    ],
    reactions: {
      type: Map,
      of: ReactionSchema,
    },
  },
  { timestamps: true }
);

export default model<IComment>("Comment", commentSchema, "comments");
