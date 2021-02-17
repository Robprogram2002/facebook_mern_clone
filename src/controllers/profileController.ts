import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Album from "../models/Album";
import { CustomError } from "./controllerTypes";
import { JobData, SchoolData } from "../models/modelTypes";

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

    const user = await User.findById(userId)!;
    // @ts-ignore
    user.profile?.imageProfile = imageProfile;

    const post = await Post.create({
      creator: {
        name: user?.userName!,
        profilePic: imageProfile,
        _id: user?._id,
      },
      contentText: description,
      contentImage: imageProfile,
      type: "album",
      status: "active",
      comments: [],
      reactions: [],
      likes: [],
    });

    user?.posts.push(post._id);

    const defaultAlbumName = "Perfil Photos";

    const perfilAlbum = await Album.findOne({
      userId: user?._id,
      title: defaultAlbumName,
    });

    if (!perfilAlbum) {
      const newAlbum = await Album.create({
        userId: user?._id,
        title: defaultAlbumName,
        items: [post._id],
        cover: imageProfile,
      });

      await newAlbum.save();

      user?.albums.push(newAlbum._id);

      post.gallery = {
        title: newAlbum.title,
        id: newAlbum._id,
      };
    } else {
      perfilAlbum.items!.push(post._id);
      perfilAlbum.cover = imageProfile;
      post.gallery = {
        title: perfilAlbum.title,
        id: perfilAlbum._id,
      };
      await perfilAlbum.save();
    }

    await user?.save();
    await post.save();

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
    const user = await User.findById(userId)!;

    //@ts-ignore
    user?.profile.portada = imagePortada;

    const post = await Post.create({
      creator: {
        name: user?.userName!,
        profilePic: user?.profile?.imageProfile!,
        _id: user?._id,
      },
      contentText: description,
      contentImage: imagePortada,
      type: "album",
      status: "active",
      comments: [],
      reactions: [],
      likes: [],
    });

    user?.posts.push(post._id);
    const defaultAlbumName = "Cover Photos";

    const portadaAlbum = await Album.findOne({
      userId: user?._id,
      title: defaultAlbumName,
    });

    if (!portadaAlbum) {
      const newAlbum = await Album.create({
        userId: user?._id,
        title: defaultAlbumName,
        items: [post._id],
        cover: imagePortada,
      });

      await newAlbum.save();

      post.gallery = {
        title: newAlbum.title,
        id: newAlbum._id,
      };

      user?.albums.push(newAlbum._id);
    } else {
      portadaAlbum.items!.push(post._id);
      portadaAlbum.cover = imagePortada;

      post.gallery = {
        title: portadaAlbum.title,
        id: portadaAlbum._id,
      };
      await portadaAlbum.save();
    }

    await post.save();
    await user?.save();

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
    const userInfo = await User.findById(userId, "profile.information")!;
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
    const userInfo = await User.findById(userId, "profile.information")!;
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
    const userInfo = await User.findById(userId, "profile.information");
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
    const userInfo = await User.findById(userId, "profile.information");

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
    const user = await User.findById(userId, "profile.information")!;

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
    const userAlbums = await User.findById(userId, "albums").populate("albums");

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
      .populate("albums");

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

export const addFollowHnalder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const followUserId = req.body.followId;

  try {
    const currentUser = await User.findById(userId, "follows");
    const followUser = await User.findById(followUserId, "followers");

    const followUserIndex = currentUser?.follows.findIndex(
      (value) => value.toString() === followUserId.toString()
    );
    console.log(followUserIndex);

    if (followUserIndex === -1) {
      currentUser?.follows.push(followUser?._id);
      followUser?.followers.push(currentUser?._id);
      await currentUser?.save();
      await followUser?.save();
      res.status(200).json({
        messege: "the relation follow-follower has been created",
        userFollows: currentUser?.follows,
      });
    } else {
      currentUser?.follows.splice(followUserIndex!, 1);
      const followerUserIndex = followUser?.followers.findIndex(
        (value) => value.toString() === userId
      );
      followUser?.followers.splice(followerUserIndex!, 1);
      await currentUser?.save();
      await followUser?.save();

      res.status(200).json({
        messege: "the relation follow-follower has been deleted",
        userFollows: currentUser?.follows,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
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
    const userFollows = await User.findById(userId, "follows").populate(
      "follows",
      "userName profile.imageProfile follows followers",
      "User"
    );

    if (!userFollows) {
      return res
        .status(404)
        .json({ messege: "No user was found with this id", userId });
    }

    res.status(200).json({
      messege: "result for fetch all the user follows",
      follows: userFollows?.follows,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getFollowersHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;

  try {
    const userFollowers = await User.findById(userId, "followers").populate(
      "followers",
      "userName profile.imageProfile follows followers",
      "User"
    );

    if (!userFollowers) {
      return res
        .status(404)
        .json({ messege: "No user was found with this id", userId });
    }

    res.status(200).json({
      messege: "result for fetch all the user followers",
      followers: userFollowers?.followers,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
