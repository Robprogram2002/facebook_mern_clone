import { Schema, Document, model } from "mongoose";
import {
  Like,
  LikeSchema,
  OwnerSchema,
  Reaction,
  ReactionSchema,
} from "./modelTypes";
import Post from "./Post";
import Response from "./Response";

export interface IComment extends Document {
  author: {
    _id: string;
    name: string;
    profilePic: string;
  };
  contentText?: string;
  contentImage?: string;
  likes: Map<string, Like>;
  reactions: Map<string, Reaction>;
  responses: string[];
}

const commentSchema = new Schema(
  {
    author: OwnerSchema,
    contentText: {
      type: String,
    },
    contentImage: {
      type: String,
    },
    likes: {
      type: Map,
      of: LikeSchema,
      default: {},
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
      default: {},
    },
  },
  { timestamps: true }
);

commentSchema.pre("remove", async function (this: IComment) {
  await Response.deleteMany({ _id: { $in: this.responses } });
});

export default model<IComment>("Comment", commentSchema, "comments");
