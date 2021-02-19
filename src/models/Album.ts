import { Schema, model, Document } from "mongoose";
import Comment from "./Comment";
import { OwnerSchema, Like, LikeSchema } from "./modelTypes";
import User from "./User";

export interface IAlbum extends Document {
  creator: {
    name: string;
    _id: string;
    profilePic: string;
  };
  title: string;
  description?: string;
  status: "active" | "suspended" | "deleted";
  items: string[];
  comments: any[];
  likes: Map<string, Like>;
  cover: string;
}

const albumSchema = new Schema(
  {
    creator: OwnerSchema,
    description: {
      type: String,
      maxlength: [250, "too long description"],
    },
    title: {
      type: String,
      required: true,
      minlength: [3, "too short title"],
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
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
    likes: {
      type: Map,
      of: LikeSchema,
    },
  },
  { timestamps: true }
);

albumSchema.post("remove", async function (this: IAlbum) {
  // await Comment.deleteMany({ _id: { $in: this.comments } });
  await Comment.find({ _id: { $in: this.comments } })
    .lean()
    .remove()
    .exec();

  const user = await User.findById(this.creator._id).select(["albums"]).exec();
  user!.albums = user?.albums.filter(
    (id) => id.toString() !== this.id.toString()
  )!;

  await user?.save();
});

albumSchema.index({ title: 1, "creator._id": 1 });

export default model<IAlbum>("Album", albumSchema, "albums");
