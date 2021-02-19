import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/User";
import Post from "../models/Post";
import Album from "../models/Album";
import { CustomError } from "./controllerTypes";
import { JobData, SchoolData } from "../models/modelTypes";
import moongose, { Types } from "mongoose";

export const profileImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const imageProfile: string = req.body.imageProfile;
  const description = req.body.description;

  try {
    if (!imageProfile) {
      const error: CustomError = {
        name: "Profile image update error",
        messages: {
          errors: [
            {
              value: imageProfile,
              msg: "Must be an image profile to save",
              param: "imageProfile",
            },
          ],
        },
        status: 400,
      };
      throw error;
    }

    const user = await User.findById(userId).select([
      "profile.imageProfile ",
      "userName",
      "posts",
    ])!;

    user!.profile.imageProfile = imageProfile;

    const post = new Post({
      creator: {
        name: user?.userName,
        profilePic: imageProfile,
        _id: user?._id,
      },
      contentText: description,
      contentImage: imageProfile,
      type: "album",
    });

    user?.posts.push(post._id);

    const defaultAlbumName = "Perfil Photos";

    const perfilAlbum = await Album.findOne({
      "creator._id": userId,
      title: defaultAlbumName,
    })
      .select(["items", "cover"])
      .exec();

    if (!perfilAlbum) {
      const newAlbum = new Album({
        creator: {
          _id: userId,
          name: user?.userName,
          profilePic: user?.profile.imageProfile,
        },
        title: defaultAlbumName,
        items: [post._id],
        cover: imageProfile,
      });

      await newAlbum.save();

      user?.albums.push(newAlbum._id);

      post.gallery = {
        title: newAlbum.title,
        id: newAlbum._id,
        coverImage: imageProfile,
      };
    } else {
      perfilAlbum.items!.push(post._id);
      perfilAlbum.cover = imageProfile;
      post.gallery = {
        title: perfilAlbum.title,
        id: perfilAlbum._id,
        coverImage: imageProfile,
      };
      await perfilAlbum.save();
    }

    await Promise.all([user?.save(), post.save()]);

    res.status(201).json({
      messege: "user profile image updated",
      userProfile: user?.profile,
    });
  } catch (err) {
    next(err);
  }
};

export const portadaImageHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const imagePortada: string = req.body.imagePortada;
  const description = req.body.description;

  try {
    if (!imagePortada) {
      const error: CustomError = {
        name: "Cover image update error",
        messages: {
          errors: [
            {
              value: imagePortada,
              msg: "Must be a cover image to save",
              param: "imagePortada",
            },
          ],
        },
        status: 400,
      };
      throw error;
    }
    const user = await User.findById(userId)
      .select(["userName", "profile.imageProfile", "posts"])
      .exec()!;

    user!.profile.portada = imagePortada;

    const post = new Post({
      creator: {
        name: user?.userName,
        profilePic: user?.profile.imageProfile,
        _id: user?._id,
      },
      contentText: description,
      contentImage: imagePortada,
      type: "album",
    });

    user?.posts.push(post._id);
    const defaultAlbumName = "Cover Photos";

    const portadaAlbum = await Album.findOne({
      "creator._id": userId,
      title: defaultAlbumName,
    })
      .select(["items", "cover"])
      .exec();

    if (!portadaAlbum) {
      const newAlbum = new Album({
        creator: {
          _id: userId,
          name: user?.userName,
          profilePic: user?.profile.imageProfile,
        },
        title: defaultAlbumName,
        items: [post._id],
        cover: imagePortada,
      });

      await newAlbum.save();

      post.gallery = {
        title: newAlbum.title,
        id: newAlbum._id,
        coverImage: imagePortada,
      };

      user?.albums.push(newAlbum._id);
    } else {
      portadaAlbum.items!.push(post._id);
      portadaAlbum.cover = imagePortada;

      post.gallery = {
        title: portadaAlbum.title,
        id: portadaAlbum._id,
        coverImage: imagePortada,
      };
      await portadaAlbum.save();
    }

    await Promise.all([user?.save(), post.save()]);

    res.status(201).json({
      messege: "user's cover image updated",
      userProfile: user?.profile,
    });
  } catch (err) {
    next(err);
  }
};

export const generalInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const completeName = req.body.completeName;
  const movil: number[] = req.body.movil;
  const age = req.body.age;
  const gender = req.body.gender;
  const birthday = req.body.birthday;

  try {
    const userInfo = await User.findById(
      userId,
      "profile.information.general"
    )!;
    const { profile } = userInfo!;

    // if (completeName) {
    //   profile!.information!.general!.completeName = completeName;
    // } else if (age) {
    //   profile!.information!.general!.Age = age;
    // } else if (gender) {

    // }

    profile!.information!.general = {
      completeName: completeName,
      Age: parseInt(age),
      gender: gender,
      birthDay: birthday,
      movil: [...profile?.information?.general?.movil!, ...movil],
    };

    await userInfo?.save();

    res.status(201).json({
      messege: "the user's basic information has been updated",
      userInfo: userInfo?.profile!.information,
    });
  } catch (err) {
    next(err);
  }
};

export const educationInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const schools: SchoolData[] = req.body.schools;
  const jobs: JobData[] = req.body.jobs;

  try {
    if ((schools.length === 0 && jobs.length === 0) || (!schools && !jobs)) {
      const error: CustomError = {
        name: "Update user's education info error",
        messages: {
          errors: [
            {
              value: [],
              msg: "Must be a job or school data to save",
              param: "schools , jobs",
            },
          ],
        },
        status: 400,
      };

      throw error;
    }
    const userInfo = await User.findById(
      userId,
      "profile.information.education"
    )!;
    const { profile } = userInfo!;

    profile!.information!.education = {
      jobs: [...profile?.information?.education?.jobs!, ...jobs],
      schools: [...profile?.information?.education?.schools!, ...schools],
    };

    await userInfo?.save();

    res.status(201).json({
      messege: "user's education info updated",
      userInfo: profile!.information?.education,
    });
  } catch (err) {
    next(err);
  }
};

export const palcesInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const livingPlace = req.body.living;
  const originPlace = req.body.origin;
  const visitedPlaces: { place: string; time: string }[] = req.body.visits;

  try {
    const userInfo = await User.findById(userId, "profile.information.places");
    const { profile } = userInfo!;

    profile!.information!.places = {
      livingPlace: livingPlace,
      originPlace: originPlace,
      visit: [...profile?.information?.places?.visit!, ...visitedPlaces],
    };

    await userInfo?.save();

    res.status(201).json({
      messege: "user'places information updated",
      userInfo: profile!.information?.places,
    });
  } catch (err) {
    next(err);
  }
};

export const basicInfoHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const language = req.body.language;
  const religius = req.body.religius;
  const socials: { website: string; url: string }[] = req.body.socials;
  const interets: { title: string; content: string }[] = req.body.interets;
  const relationStatus = req.body.relationStatus;
  const profesionalStatus = req.body.profesionalStatus;

  try {
    const userInfo = await User.findById(
      userId,
      "profile.information.basicInfo"
    );

    userInfo!.profile!.information!.basicInfo = {
      language,
      religius,
      socials: [
        ...userInfo?.profile?.information?.basicInfo?.socials!,
        ...socials,
      ],
      interets: [
        ...userInfo?.profile?.information?.basicInfo?.interets!,
        ...interets,
      ],
      relationStatus,
      profesionalStatus,
    };

    await userInfo?.save();

    res.status(201).json({
      messege: "user'basic information updated",
      userInfo: userInfo?.profile!.information?.basicInfo,
    });
  } catch (err) {
    next(err);
  }
};

export const lifeEventsIfonHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const events: { title: string; content: string; date: string }[] =
    req.body.events;

  try {
    if (!events || events.length === 0) {
      const error: CustomError = {
        name: "Life events update error",
        messages: {
          errors: [
            {
              value: events,
              msg: "Must be events data for store",
              param: "events",
            },
          ],
        },
        status: 400,
      };
      throw error;
    }
    const user = await User.findById(userId, "profile.information.lifeEvents")!;

    user!.profile!.information!.lifeEvents = [
      ...user?.profile?.information?.lifeEvents!,
      ...events,
    ];

    await user?.save();
    return res.status(201).json({
      messege: "user's life events info updated",
      userLifeEvents: user?.profile?.information?.lifeEvents,
    });
  } catch (error) {
    next(error);
  }
};

export const getALbumsHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    // const userAlbums = await User.findById(userId, "albums")
    //   .populate("albums")
    //   .lean()
    //   .exec();

    const userAlbums = await User.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "albums",
          localField: "albums",
          foreignField: "_id",
          as: "albums",
        },
      },
    ]).exec();

    if (!userAlbums) {
      const error: CustomError = {
        name: "Get user's albums error",
        messages: {
          errors: [
            {
              value: userId,
              msg: "not user found",
              param: "userId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res.status(201).json({
      messege: "user's albums",
      albums: userAlbums?.albums,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId, "-password")
      .populate("posts")
      .populate("follows")
      .populate("followers")
      .populate("albums")
      .lean()
      .exec();

    if (!user) {
      return res
        .status(404)
        .json({ messege: "Not user was found with this id", userId });
    }

    res.status(200).json({
      messege: "user profile information",
      userinfo: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const addFollowHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const followUserId = req.body.followId;

  try {
    const currentUser = await User.findById(userId).select(["follows"]).exec();
    const followUser = await User.findById(followUserId).select([
      "followers",
      "friendRequests",
    ]);

    if (!currentUser) {
      const error: CustomError = {
        name: "Add follow error",
        messages: {
          errors: [
            {
              value: userId,
              msg: "not user found",
              param: "userId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    } else if (!followUser) {
      const error: CustomError = {
        name: "Add follow error",
        messages: {
          errors: [
            {
              value: followUserId,
              msg: "not user found",
              param: "followId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const followUserIndex = currentUser?.follows.findIndex(
      (value) => value.toString() === followUserId.toString()
    );

    if (followUserIndex !== -1) {
      return res.json({ messege: "this user is already send a request" });
    }

    const requestId = moongose.Types.ObjectId();
    followUser?.friendRequests.set(requestId.toHexString(), {
      fromUser: {
        userId,
        profilePic: currentUser?.profile?.imageProfile!,
        username: currentUser?.userName!,
      },
      createdAt: new Date(),
      status: "pending",
      saw: false,
    });

    currentUser?.follows.push(followUserId);
    followUser?.followers.push(userId);

    await Promise.all([currentUser?.save(), followUser?.save()]);

    res.status(200).json({
      messege: "relation follow-follower created and request sent",
      userFollows: currentUser?.follows,
    });

    //   currentUser?.follows.splice(followUserIndex!, 1);
    //   const followerUserIndex = followUser?.followers.findIndex(
    //     (value) => value.toString() === userId
    //   );
    //   followUser?.followers.splice(followerUserIndex!, 1);
    //   await currentUser?.save();
    //   await followUser?.save();

    //   res.status(200).json({
    //     messege: "the relation follow-follower has been deleted",
    //     userFollows: currentUser?.follows,
    //   });
  } catch (err) {
    next(err);
  }
};

export const getFollowsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    // const userFollows = await User.findById(userId, "follows")
    //   .populate(
    //     "follows",
    //     "userName profile.imageProfile follows followers",
    //     "User"
    //   )
    //   .lean()
    //   .exec();

    const userFollows = await User.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "follows",
          foreignField: "_id",
          as: "follows",
        },
      },
    ]).exec();

    if (!userFollows) {
      const error: CustomError = {
        name: "Get follows error",
        messages: {
          errors: [
            {
              value: userId,
              msg: "not user found",
              param: "userId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res.status(200).json({
      messege: "fetch all the user follows",
      follows: userFollows?.follows,
    });
  } catch (err) {
    next(err);
  }
};

export const getFollowersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    // const userFollowers = await User.findById(userId, "followers")
    //   .populate(
    //     "followers",
    //     "userName profile.imageProfile follows followers",
    //     "User"
    //   )
    //   .lean()
    //   .exec();

    const userFollowers: IUser = await User.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
    ]).exec();

    if (!userFollowers) {
      const error: CustomError = {
        name: "Get followers error",
        messages: {
          errors: [
            {
              value: userId,
              msg: "not user found",
              param: "userId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res.status(200).json({
      messege: "result for fetch all the user followers",
      followers: userFollowers?.followers,
    });
  } catch (err) {
    next(err);
  }
};

export const makeFriendHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId: string = res.locals.userId;
  const requestId = req.params.requestId;

  try {
    const user = await User.findById(userId)
      .select(["follows", "friends", "friendRequests"])
      .exec();
    const request = user?.friendRequests.get(requestId);

    if (!request) {
      const error: CustomError = {
        name: "Make friend error",
        messages: {
          errors: [
            {
              value: requestId,
              msg: "not request found",
              param: "requestId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const fromUser = await User.findById(request.fromUser.userId)
      .select(["followers", "friends"])
      .exec();

    user!.follows = user?.follows.filter(
      (id) => id.toString() !== request.fromUser.userId.toString()
    )!;
    user?.friends.push(request.fromUser.userId);

    fromUser!.followers = fromUser?.followers.filter(
      (id) => id.toString() !== userId.toString()
    )!;
    fromUser?.friends.push(userId);

    user?.friendRequests.delete(requestId);

    await Promise.all([user?.save(), fromUser?.save()]);

    return res.status(201).json({
      messege: "Friend relation created",
      userFriends: user?.friends,
      userRequest: user?.friendRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const refuseRequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const requestId = req.params.requestId;

  try {
    const user = await User.findById(userId).select(["friendRequests"]).exec();
    user?.friendRequests.delete(requestId);

    await user?.save();

    return res
      .status(201)
      .json({ messege: "request deleted", userRequests: user?.friendRequests });
  } catch (error) {
    next(error);
  }
};

export const markRequestSawHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;

  try {
    const user = await User.findById(userId).select(["friendRequests"]).exec();

    user?.friendRequests.forEach((request, id) => {
      request.saw = true;
    });

    await user?.save();

    return res.status(201).json({
      messege: "requests updated",
      userRequests: user?.friendRequests,
    });
  } catch (error) {
    next(error);
  }
};
