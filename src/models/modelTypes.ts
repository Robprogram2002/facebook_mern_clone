import { Schema } from "mongoose";

export type Like = {
  username: string;
  userProfile: string;
};

export type Reaction = {
  username: string;
  instance: string;
  userProfile: string;
};

export interface SchoolData {
  place: string;
  college: string;
  level: string;
  description: string;
}

export interface JobData {
  position: string;
  place: string;
  description: string;
  period: string;
}

// export interface LikeMap {
//   [userId: string]: { username: string };
// }

// export interface ReactionMap {
//   [userId: string]: { username: string; instance: string };
// }

// export interface ResponseMap {
//   [responseId: string]: {
//     author: {
//       userId: string;
//       username: string;
//       profilePic: string;
//     };
//     contentText?: string;
//     contentImage?: string;
//     likes: LikeMap;
//   };
// }

export type reactionType = "smile" | "angry" | "surprise" | "love" | "hate";

export const ReactionSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userProfile: {
      type: String,
      required: true,
    },
    instance: {
      type: String,
      required: true,
      enum: ["happy", "angry", "love", "laugh", "hate"],
    },
  },
  { _id: false, id: false }
);

export const LikeSchema = new Schema(
  {
    userProfile: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  { _id: false, id: false }
);

export const OwnerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    _id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
  },
  { _id: false, id: false }
);
