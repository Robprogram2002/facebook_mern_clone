import { Schema, model, Document } from "mongoose";
import { Like, LikeSchema, Reaction, ReactionSchema } from "./modelTypes";

export interface IPost extends Document {
  creator: {
    name: string;
    _id: string;
    profilePic: string;
  };
  contentText?: string;
  contentImage?: string;
  contentVideo?: string;
  type: string;
  status: "active" | "suspended" | "deleted";
  comments: string[];
  // reactions: Record<string, Reaction>;
  reactions: Map<string, Reaction>;
  // likes: Record<string, Like>;
  likes: Map<string, Like>;
  gallery?: {
    title: string;
    id: string;
  };
  comunityId?: string;
}

const postSchema = new Schema(
  {
    creator: {
      name: String,
      _id: Schema.Types.ObjectId,
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
    contentVideo: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: "post",
    },
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
    reactions: {
      type: Map,
      of: ReactionSchema,
    },
    likes: {
      type: Map,
      of: LikeSchema,
    },
    gallery: {
      title: String,
      id: Schema.Types.ObjectId,
    },
    comunityId: {
      type: Schema.Types.ObjectId,
      ref: "Comunity",
    },
  },
  { timestamps: true }
);

export default model<IPost>("Post", postSchema, "posts");
