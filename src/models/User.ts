import { Schema, model, Document } from "mongoose";
import Album from "./Album";
import { JobData, SchoolData } from "./modelTypes";
import Post from "./Post";

interface Favorite {
  entityType: string;
  entityId: string;
  createdAt: any;
}

interface LifeEvent {
  title: String;
  content: String;
  date: String;
}

interface Notification {
  fromUser: {
    userId: string;
    username: string;
    profilePic: string;
  };
  entityType: string;
  entityId: string;
  notificationType: string;
  createdAt: any;
  status: string;
}

interface FriendRequest {
  fromUser: {
    userId: string;
    username: string;
    profilePic: string;
  };
  status: string;
  createdAt: any;
  saw: boolean;
}

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  user_type: "user" | "admin";
  accountStatus: "active" | "suspended" | "canceled";
  profile: {
    imageProfile: string;
    portada: string;
    information?: {
      general?: {
        completeName?: string;
        movil?: number[];
        Age?: number;
        gender?: string;
        birthDay?: any;
      };
      education?: {
        schools?: SchoolData[];
        jobs?: JobData[];
      };
      places?: {
        livingPlace?: string;
        originPlace?: string;
        visit?: Array<{ place: string; time: string }>;
      };
      basicInfo?: {
        language?: string;
        religius?: string;
        socials?: Array<{ website: string; url: string }>;
        interets?: Array<{ title: string; content: string }>;
        relationStatus?: string;
        profesionalStatus?: string;
      };
      lifeEvents?: LifeEvent[];
    };
  };
  posts: string[];
  follows: string[];
  followers: string[];
  friends: string[];
  albums: string[];
  favorites: Favorite[];
  settings: {
    darkMode: boolean;
    language: string;
    notificationSettings: {
      commentNotifications: boolean;
      reactNotifications: boolean;
      tagNotifications: boolean;
      // whereSend?: string;
    };
    security: {
      publicStories: boolean;
      publicProfile: boolean;
      publicPosts: boolean;
    };
  };
  notifications: Map<string, Notification>;
  friendRequests: Map<string, FriendRequest>;
  storieId?: string;
}

const NotificationSchema = new Schema(
  {
    fromUser: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      profilePic: String,
    },
    entityType: String,
    entityId: Schema.Types.ObjectId,
    notificationType: String,
    createdAt: Schema.Types.Date,
    status: String,
  },
  { _id: false, id: false }
);

const FriendRequestSchema = new Schema(
  {
    fromUser: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      username: String,
      profilePic: String,
    },
    status: String,
    saw: {
      type: Boolean,
      default: false,
    },
    createdAt: Schema.Types.Date,
  },
  { _id: false, id: false }
);

const GeneralInfoSchema = new Schema(
  {
    completeName: {
      type: String,
      minlength: [4, "too short name"],
      maxlength: [60, "too long name"],
      trim: true,
    },
    movil: [Number],
    Age: {
      type: Number,
      min: [5, "too young person"],
      max: [120, "too old person"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    birthDay: Schema.Types.Date,
  },
  { _id: false, id: false }
);

const UserSchoolInfoSchema = new Schema(
  {
    place: {
      type: String,
      minlength: [3, "place name too short"],
      trim: true,
    },
    college: {
      type: String,
      minlength: [3, "college name too short"],
      trim: true,
    },
    level: {
      type: String,
      enum: [
        "preElementary",
        "elementary",
        "highSchool",
        "blacheholder",
        "master",
        "doctorado",
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "description too long"],
    },
  },
  { _id: false, id: false }
);

const UserJobInfoSchema = new Schema(
  {
    position: {
      type: String,
      trim: true,
    },
    place: {
      type: String,
      minlength: [3, "place name too short"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "description too long"],
    },
    period: String,
  },
  { _id: false, id: false }
);

const UserPlacesInfoSchema = new Schema(
  {
    livingPlace: {
      type: String,
      minlength: [4, "too short place name"],
    },
    originPlace: {
      type: String,
      minlength: [4, "too short place name"],
    },
    visit: [{ place: String, period: String }],
  },
  { _id: false, id: false }
);

const UserBasicInfoSchema = new Schema(
  {
    languages: [String],
    religius: String,
    socials: [{ website: String, url: String }],
    interets: [{ title: String, content: String }],
    relationStatus: {
      type: String,
      enum: ["single", "married", "relation", "open", "other"],
    },
    profesionalStatus: {
      type: String,
      enum: ["employed", "unemployed", "other"],
    },
  },
  { _id: false, id: false }
);

const ProfileInformationSchema = new Schema(
  {
    general: {
      type: GeneralInfoSchema,
      default: {},
    },
    education: {
      schools: [UserSchoolInfoSchema],
      jobs: [UserJobInfoSchema],
    },
    places: {
      type: UserPlacesInfoSchema,
      default: {},
    },
    basicInfo: {
      type: UserBasicInfoSchema,
      default: {},
    },
    lifeEvents: [
      {
        title: String,
        content: String,
        date: Schema.Types.Date,
      },
    ],
  },
  { _id: false, id: false }
);

const ProfileSchema = new Schema(
  {
    imageProfile: {
      type: String,
      required: true,
      default:
        "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
    },
    portada: {
      type: String,
      required: true,
      default:
        "https://images.unsplash.com/photo-1441441247730-d09529166668?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=753&q=80",
    },
    information: {
      type: ProfileInformationSchema,
      default: {},
    },
  },
  { _id: false, id: false }
);

const NotificationSettingSchema = new Schema(
  {
    commentNotifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    reactNotifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    tagNotifications: {
      type: Boolean,
      required: true,
      default: true,
    },
    // whereSend: {
    //   type: Boolean,
    //   required: true,
    //   default: true
    // },
  },
  { _id: false, id: false }
);

const SecuritySettingSchema = new Schema(
  {
    publicStories: {
      type: Boolean,
      required: true,
      default: true,
    },
    publicProfile: {
      type: Boolean,
      required: true,
      default: true,
    },
    publicPosts: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { _id: false, id: false }
);

const UserSettingSchema = new Schema(
  {
    darkMode: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      enum: ["Spanish", "English", "France"],
      default: "English",
    },
    notificationSettings: {
      type: NotificationSettingSchema,
      default: {},
    },
    security: {
      type: SecuritySettingSchema,
      default: {},
    },
  },
  { _id: false, id: false }
);

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "must there a userName"],
      trim: true,
      minlength: [3, "to short name"],
      maxlength: [50, "too long name"],
    },
    email: {
      type: String,
      required: [true, "must there an valid email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "a password is required"],
      minlength: [8, "password must be 8 characters long"],
    },
    user_type: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "canceled", "eliminated"],
      default: "active",
    },
    profile: {
      type: ProfileSchema,
      default: {},
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    follows: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    albums: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
    favorites: [
      {
        entityType: String,
        entityId: Schema.Types.ObjectId,
      },
    ],
    settings: {
      type: UserSettingSchema,
      default: {},
    },
    notifications: {
      type: Map,
      of: NotificationSchema,
      default: {},
    },
    friendRequests: {
      type: Map,
      of: FriendRequestSchema,
      default: {},
    },
    storieId: {
      type: Schema.Types.ObjectId,
      ref: "Storie",
    },
  },
  { timestamps: true }
);

userSchema.pre("remove", async function (this: IUser) {
  await Post.find({ _id: { $in: this.posts } })
    .lean()
    .remove()
    .exec();
  await Album.find({ _id: { $in: this.albums } })
    .lean()
    .remove()
    .exec();
});

userSchema.index({ email: 1 });

export default model<IUser>("User", userSchema, "users");
