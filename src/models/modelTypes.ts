import { Schema } from "mongoose";

export type Like = {
  username: string;
};

export type Reaction = {
  username: string;
  instance: string;
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
  time: string;
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
    userId: Schema.Types.ObjectId,
    username: String,
    instance: String,
  },
  { _id: false, id: false }
);

export const LikeSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    username: String,
  },
  { _id: false, id: false }
);
