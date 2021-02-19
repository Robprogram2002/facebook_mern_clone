import { Schema, model, Document } from "mongoose";
import Comment from "./Comment";
import {
  Like,
  LikeSchema,
  OwnerSchema,
  Reaction,
  ReactionSchema,
} from "./modelTypes";
import User from "./User";

export interface IPost extends Document {
  creator: {
    name: string;
    _id: string;
    profilePic: string;
  };
  contentText?: string;
  contentImage?: string;
  contentVideo?: string;
  type: "post" | "album" | "newAlbum" | "conmunity";
  status: "active" | "suspended" | "deleted";
  comments: string[];
  // reactions: Record<string, Reaction>;
  reactions: Map<string, Reaction>;
  // likes: Record<string, Like>;
  likes: Map<string, Like>;
  gallery?: {
    title: string;
    id: string;
    coverImage: string;
  };
  comunityId?: string;
}

const PostGallerySchema = new Schema(
  {
    galleryId: {
      type: Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  { _id: false, id: false }
);

const postSchema = new Schema(
  {
    creator: OwnerSchema,
    contentText: {
      type: String,
      trim: true,
    },
    contentImage: {
      type: String,
    },
    contentVideo: {
      type: String,
    },
    type: {
      type: String,
      enum: ["post", "album", "newAlbum", "conmunity"],
      default: "post",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
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
      default: {},
    },
    likes: {
      type: Map,
      of: LikeSchema,
      default: {},
    },
    gallery: PostGallerySchema,
    comunityId: {
      type: Schema.Types.ObjectId,
      ref: "Comunity",
    },
  },
  { timestamps: true }
);

postSchema.pre("remove", async function (this: IPost) {
  await Comment.find({ _id: { $in: this.comments } })
    .lean()
    .remove()
    .exec();

  const user = await User.findById(this.creator._id).select(["posts"]).exec();
  user!.posts = user?.posts.filter(
    (id) => id.toString() !== this.id.toString()
  )!;

  await user?.save();
});

export default model<IPost>("Post", postSchema, "posts");
