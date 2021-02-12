// import { Request, Response, NextFunction } from "express";
// import { validationResult } from "express-validator";
// import User from "../models/User";
// import Post from "../models/Post";
// import Album from "../models/Album";

// export const profileImageHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const imageProfile = req.body.imageProfile;
//   const description = req.body.description;

//   try {
//     const user = await User.findById(userId);
//     // await User.updateOne(
//     //   { _id: user?._id },
//     //   { $set: { "profile.imageProfile": imageProfile } }
//     // );
//     //@ts-ignore
//     user?.profile.imageProfile = imageProfile;

//     const post = new Post({
//       creator: {
//         name: user?.userName,
//         perfilImage: imageProfile,
//         _id: user?._id,
//       },
//       contentText: description,
//       contentImage: imageProfile,
//     });
//     await post.save();
//     user?.posts.push(post);

//     const perfilAlbum = await Album.findOne({
//       userId: user?._id,
//       title: "Perfil Photos",
//     });

//     if (!perfilAlbum) {
//       const newAlbum = new Album({
//         userId: user?._id,
//         title: "Perfil Photos",
//         items: [
//           {
//             mediaUrl: imageProfile,
//             postId: post._id,
//           },
//         ],
//       });

//       await newAlbum.save();
//       user?.albums.push(newAlbum);
//     } else {
//       perfilAlbum.items!.push({ mediaUrl: imageProfile, postId: post._id });
//       await perfilAlbum.save();
//     }

//     await user?.save();

//     res.status(201).json({
//       messege: "the user's profile image with this id has been updated",
//       userProfile: user?.profile,
//       post: post,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const portadaImageHanlder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const imagePortada = req.body.imagePortada;
//   const description = req.body.description;

//   try {
//     const user = await User.findById(userId);
//     // await User.updateOne(
//     //   { _id: user?._id },
//     //   { $set: { "profile.imageProfile": imageProfile } }
//     // );
//     //@ts-ignore
//     user?.profile.portada = imagePortada;

//     const post = new Post({
//       creator: {
//         name: user?.userName,
//         perfilImage: user?.profile.imageProfile,
//         _id: user?._id,
//       },
//       contentText: description,
//       contentImage: imagePortada,
//     });
//     await post.save();

//     user?.posts.push(post);

//     const portadaAlbum = await Album.findOne({
//       userId: user?._id,
//       title: "Cover Photos",
//     });

//     if (!portadaAlbum) {
//       const newAlbum = new Album({
//         userId: user?._id,
//         title: "Cover Photos",
//         items: [
//           {
//             mediaUrl: imagePortada,
//             postId: post._id,
//           },
//         ],
//       });

//       await newAlbum.save();
//       user?.albums.push(newAlbum);
//     } else {
//       portadaAlbum.items!.push({
//         mediaUrl: imagePortada,
//         postId: post._id,
//       });
//       await portadaAlbum.save();
//     }

//     await user?.save();

//     res.status(201).json({
//       messege: "the user's portada image with this id has been updated",
//       userProfile: user?.profile,
//       post: post,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const generalInfoHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const completeName = req.body.name;
//   const movil = req.body.movil;
//   const age = req.body.age;
//   const gender = req.body.gender;
//   const birthday = req.body.birthday;

//   try {
//     const userInfo = await User.findById(userId, "profile.information");
//     //@ts-ignore
//     userInfo?.profile.information.general = {
//       completeName: completeName,
//       movil: parseInt(movil),
//       Age: parseInt(age),
//       gender: gender,
//       birthDay: birthday,
//     };

//     await userInfo?.save();

//     res.status(201).json({
//       messege: "the user's basic information has been updated",
//       userInfo: userInfo?.profile.information,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const educationInfoHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const job = req.body.job;
//   const jobPlace = req.body.jobPlace;
//   const college = req.body.college;
//   const highSchool = req.body.highSchool;

//   try {
//     const userInfo = await User.findById(userId, "profile.information");
//     //@ts-ignore
//     userInfo?.profile.information.education = {
//       job: job,
//       jobPlace: jobPlace,
//       college: college,
//       highSchool: highSchool,
//     };

//     await userInfo?.save();

//     res.status(201).json({
//       messege: "the user's education information has been updated",
//       userInfo: userInfo?.profile.information,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const palcesInfoHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const livingPlace = req.body.living;
//   const originPlace = req.body.origin;
//   const visitedPlaces = req.body.visits;

//   try {
//     const userInfo = await User.findById(userId, "profile.information");
//     //@ts-ignore
//     userInfo?.profile.information.places = {
//       livingPlace: livingPlace,
//       originPlace: originPlace,
//       visit: visitedPlaces,
//     };

//     await userInfo?.save();

//     res.status(201).json({
//       messege: "the user'places information has been updated",
//       userInfo: userInfo?.profile.information,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const basicInfoHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const language = req.body.language;
//   const religius = req.body.religius;
//   const socials = req.body.socials;
//   const interets = req.body.interets;
//   const relationStatus = req.body.relationStatus;
//   const profesionalStatus = req.body.profesionalStatus;

//   try {
//     const userInfo = await User.findById(userId, "profile.information");
//     //@ts-ignore
//     userInfo?.profile.information.basicInfo = {
//       language: language,
//       religius: religius,
//       socials: socials,
//       interes: interets,
//       relationStatus: relationStatus,
//       profesionalStatus: profesionalStatus,
//     };

//     await userInfo?.save();

//     res.status(201).json({
//       messege: "the user'basic  information has been updated",
//       userInfo: userInfo?.profile.information,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const lifeEventsIfonHanlder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// export const getALbumsHanlder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.params.userId;

//   try {
//     const userAlbums = await User.findById(userId, "albums").populate("albums");

//     res.status(201).json({
//       messege: "fetch albums for this user Id",
//       albums: userAlbums?.albums,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const getUserInfo = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.params.userId;

//   try {
//     const user = await User.findById(userId, "-password")
//       .populate("posts")
//       .populate("follows")
//       .populate("followers")
//       .populate("albums");

//     if (!user) {
//       return res
//         .status(404)
//         .json({ messege: "Not user was found with this id", userId });
//     }

//     res.status(200).json({
//       messege: "user profile information",
//       userinfo: user,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const addFollowHnalder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = res.locals.userId;
//   const followUserId = req.body.followId;

//   try {
//     const currentUser = await User.findById(userId, "follows");
//     const followUser = await User.findById(followUserId, "followers");

//     const followUserIndex = currentUser?.follows.findIndex(
//       (value) => value.toString() === followUserId.toString()
//     );
//     console.log(followUserIndex);

//     if (followUserIndex === -1) {
//       currentUser?.follows.push(followUser);
//       followUser?.followers.push(currentUser);
//       await currentUser?.save();
//       await followUser?.save();
//       res.status(200).json({
//         messege: "the relation follow-follower has been created",
//         userFollows: currentUser?.follows,
//       });
//     } else {
//       currentUser?.follows.splice(followUserIndex!, 1);
//       const followerUserIndex = followUser?.followers.findIndex(
//         (value) => value.toString() === userId
//       );
//       followUser?.followers.splice(followerUserIndex!, 1);
//       await currentUser?.save();
//       await followUser?.save();

//       res.status(200).json({
//         messege: "the relation follow-follower has been deleted",
//         userFollows: currentUser?.follows,
//       });
//     }
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const getFollowsHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.params.userId;

//   try {
//     const userFollows = await User.findById(userId, "follows").populate(
//       "follows",
//       "userName profile.imageProfile follows followers",
//       "User"
//     );

//     if (!userFollows) {
//       return res
//         .status(404)
//         .json({ messege: "No user was found with this id", userId });
//     }

//     res.status(200).json({
//       messege: "result for fetch all the user follows",
//       follows: userFollows?.follows,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// export const getFollowersHanlder = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const userId = req.params.userId;

//   try {
//     const userFollowers = await User.findById(userId, "followers").populate(
//       "followers",
//       "userName profile.imageProfile follows followers",
//       "User"
//     );

//     if (!userFollowers) {
//       return res
//         .status(404)
//         .json({ messege: "No user was found with this id", userId });
//     }

//     res.status(200).json({
//       messege: "result for fetch all the user followers",
//       followers: userFollowers?.followers,
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };
