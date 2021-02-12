import { Schema, model, Document } from "mongoose";

interface Favorite {
  entityType: string;
  entityId: string;
  createdAt: any;
}

interface SchoolData {
  place: string;
  college: string;
  level: string;
  description: string;
}

interface JobData {
  position: string;
  place: string;
  description: string;
  time: string;
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
}

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  user_type: string;
  accountStatus?: "active" | "suspended" | "canceled";
  profile?: {
    imageProfile?: string;
    portada?: string;
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
  settings?: {
    darkMode?: {
      type: boolean;
      default: true;
    };
    language?: string;
    notificationSettings?: {
      commentNotifications?: {
        type: boolean;
        default: true;
      };
      reactNotifications?: {
        type: boolean;
        default: true;
      };
      tagNotifications?: {
        type: boolean;
        default: true;
      };
      whereSend?: string;
    };
    security?: {
      publicStories?: {
        type: boolean;
        default: true;
      };
      publicProfile?: {
        type: boolean;
        default: true;
      };
      publicPosts?: {
        type: boolean;
        default: true;
      };
    };
  };
  notifications: Map<string, Notification>;
  friendRequests: Map<string, FriendRequest>;
  storieId?: string;
}

const NotificationSchema = new Schema({
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
});

const FriendRequestSchema = new Schema({
  fromUser: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
    profilePic: String,
  },
  status: String,
  createdAt: Schema.Types.Date,
});

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    user_type: {
      type: String,
      default: "user",
    },
    accountStatus: {
      type: String,
      default: "active",
    },
    profile: {
      imageProfile: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1502&q=80",
      },
      portada: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1441441247730-d09529166668?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=753&q=80",
      },
      information: {
        general: {
          completeName: String,
          movil: [Number],
          Age: Number,
          gender: String,
          birthDay: Schema.Types.Date,
        },
        education: {
          schools: [
            {
              place: String,
              college: String,
              level: String,
              description: String,
            },
          ],
          jobs: [
            {
              position: String,
              place: String,
              description: String,
              time: String,
            },
          ],
        },
        places: {
          livingPlace: String,
          originPlace: String,
          visit: [{ place: String, time: String }],
        },
        basicInfo: {
          language: String,
          religius: String,
          socials: [{ website: String, url: String }],
          interets: [{ title: String, content: String }],
          relationStatus: String,
          profesionalStatus: String,
        },
        lifeEvents: [
          {
            title: String,
            content: String,
            date: String,
          },
        ],
      },
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
        createdAt: Schema.Types.Date,
      },
    ],
    settings: {
      darkMode: {
        type: Boolean,
        default: false,
      },
      language: String,
      notificationSettings: {
        commentNotifications: Boolean,
        reactNotifications: Boolean,
        tagNotifications: Boolean,
        whereSend: String,
      },
      security: {
        publicStories: Boolean,
        publicProfile: Boolean,
        publicPosts: Boolean,
      },
    },
    notifications: {
      type: Map,
      of: NotificationSchema,
    },
    friendRequests: {
      type: Map,
      of: FriendRequestSchema,
    },
    storieId: {
      type: Schema.Types.ObjectId,
      ref: "Storie",
    },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema, "users");
