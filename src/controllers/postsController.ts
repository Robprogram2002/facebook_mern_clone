import { Request, Response, NextFunction } from "express";
// import { validationResult } from "express-validator";
import cloudinary from "../utils/cloudinary";
import User from "../models/User";
import Post from "../models/Post";
import { CustomError } from "./controllerTypes";
import Comment from "../models/Comment";

export const createHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     const error = new Error('Validation failed, entered data is incorrect.');
  //     throw error;
  //   }
  const contentText: string = req.body.contentText;
  const contentImage = req.body.contentImage;
  const contentVideo = req.body.contentVideo;
  const userId = res.locals.userId;

  try {
    if (!contentText && !contentImage && !contentVideo) {
      const error: CustomError = {
        name: "Post create error",
        messages: {
          errors: [
            {
              value: "",
              msg: "The post's content cannot be empty",
              param: "",
            },
          ],
        },
        status: 201,
      };
      throw error;
    }

    const user = await User.findById(
      userId,
      "posts userName profile.imageProfile"
    );

    if (!user) {
      const error: CustomError = {
        name: "Post create error",
        messages: {
          errors: [
            {
              value: userId,
              msg: "Not user found with this id",
              param: "userId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    let imageUrl;

    if (contentImage && contentImage !== "") {
      try {
        //@ts-ignore
        const uploadedResponse = await cloudinary.uploader.upload_large(
          contentImage,
          {
            upload_preset: "ml_default",
            chunk_size: 6000000,
          }
        );
        imageUrl = uploadedResponse.url;
      } catch (err) {
        console.error(err);
        res.status(500).json("oh nooooooooooo");
      }
    }

    let videoUrl;
    console.log("emqwkmjowmqjm");
    if (contentVideo && contentVideo !== "") {
      try {
        console.log("hegewqqg qww quy qwuy tweq we ");
        //@ts-ignore
        const uploadedResponse = await cloudinary.uploader.upload_large(
          contentVideo,
          {
            upload_preset: "ml_default",
            resource_type: "video",
            chunk_size: 6000000,
          }
        );
        videoUrl = uploadedResponse.url;
      } catch (err) {
        console.error(err);
        res.status(500).json("oh nooooooooooo video");
      }
    }

    // create and save post
    const post = await Post.create({
      creator: {
        _id: user?._id,
        name: user?.userName,
        profilePic: user?.profile!.imageProfile!,
      },
      contentImage: imageUrl,
      contentText: contentText,
      contentVideo: contentVideo,
      type: "post",
      status: "active",
      comments: [],
      reactions: [],
      likes: [],
    });
    await post.save();

    // add postId to user'posts array
    user?.posts.push(post._id);
    await user?.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: post,
    });
  } catch (err) {
    next(err);
  }
};

export const getSingleHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error: CustomError = {
        name: "Get Single Post error",
        messages: {
          errors: [
            {
              value: postId,
              msg: "Post not found",
              param: "postId",
            },
          ],
        },
        status: 201,
      };
      throw error;
    }
    res.status(200).json({ message: "Post fetched.", post: post });
  } catch (err) {
    next(err);
  }
};

export const deleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId, "comments")!;

    if (!post) {
      const error: CustomError = {
        name: "Delete Post error",
        messages: {
          errors: [
            {
              value: postId,
              msg: "Post not found",
              param: "postId",
            },
          ],
        },
        status: 201,
      };
      throw error;
    }

    await Comment.deleteMany({ _id: { $in: post.comments } });
    await Post.deleteOne({ _id: postId });

    const user = await User.findById(userId, "posts");
    user!.posts = user?.posts.filter((id) => id !== postId)!;

    await user?.save();

    res.status(201).json({ messege: " post deleted", postId: postId });
  } catch (err) {
    next(err);
  }
};

export const getAllHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await Post.find({}).exec();
    if (!posts) {
      const error: CustomError = {
        name: "Get All Posts error",
        messages: {
          errors: [
            {
              value: "",
              msg: "Something went wrong, posts not found",
              param: "",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }
    res.status(200).json({ messege: "All the posts", posts: posts });
  } catch (err) {
    next(err);
  }
};

export const getByUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "posts").populate("posts").exec();

    if (!user) {
      const error: CustomError = {
        name: "Get Posts by user error",
        messages: {
          errors: [
            {
              value: userId,
              msg: "user not found",
              param: "userId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }
    // const userPosts = await User.findById(userId, "posts -_id").populate(
    //   "posts",
    //   {},
    //   "Post"
    // );

    // const posts = await Post.find({ "creator._id": userId }).exec();

    res.status(200).json({ message: "Posts fetchets", posts: user.posts });
  } catch (err) {
    next(err);
  }
};

export const addReactionHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.body.postId;
  const userId = res.locals.userId;
  const reaction: string = req.body.reaction;

  try {
    if (!reaction) {
      const error: CustomError = {
        name: "Post Reaction Error",
        messages: {
          errors: [
            {
              value: reaction,
              msg: "must be a reaction type",
              param: "reaction",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const post = await Post.findById(postId, "reactions");
    const user = await User.findById(userId, "userName");

    if (!post) {
      const error: CustomError = {
        name: "Post Reaction Error",
        messages: {
          errors: [
            {
              value: postId,
              msg: "Post not found",
              param: "postId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    /*   ARRAY SEARCH AND UPDATE METHOD
      const reactionIndex = post.reactions.findIndex(
        (reaction) => reaction.userId.toString() === userId.toString()
      );

      // Caso 1: There is no reaction from this user yet
      if (reactionIndex === -1) {
        post?.reactions.push({
          userId: user?.id,
          username: user?.userName!,
          instance: reaction,
        });

        await post.save();

        res.status(201).json({
          messege: "raection added successfuly",
          postReactions: post.reactions,
          reactionType: reaction,
        });
      } else {
        // Caso 2: There is already a reaction from this user
        const oldReaction = post.reactions[reactionIndex];

        // Caso 2.1: The new reaction is the same -> delete it
        if (oldReaction?.instance === reaction) {
          post?.reactions?.splice(reactionIndex!, 1);
          await post?.save();

          return res.status(201).json({
            messege: "reaction removed from this post",
            postReactions: post.reactions,
          });
        } else {
          // post.reactions.splice(reactionIndex!, 1);
          // post.reactions.push({
          //   userId: user?._id,
          //   username: user?.userName!,
          //   instance: reaction,
          // });

          // Caso 2.2: The new reaction is different -> change it
          post.reactions[reactionIndex].instance = reaction;

          await post?.save();

          res.status(201).json({
            messege: "reaction updated",
            postReactions: post?.reactions,
            oldReaction: oldReaction.instance,
            newReaction: reaction,
          });
        }
      }
    */

    // HASHTABLE / HASHMAP SEARCH AND UPDATE METHOD
    const currentReaction = post.reactions.get(userId);

    // Caso 1: There is no reaction from this user yet
    if (!currentReaction) {
      post.reactions.set(userId, {
        username: user?.userName!,
        instance: reaction,
      });

      await post.save();

      res.status(201).json({
        messege: "raection added successfuly",
        postReactions: post.reactions,
        reactionType: reaction,
      });
    } else {
      // Caso 2: There is already a reaction from this user

      // Caso 2.1: The new reaction is the same -> delete it
      if (currentReaction.instance === reaction) {
        post.reactions.delete(userId);
        await post?.save();

        return res.status(201).json({
          messege: "reaction removed from this post",
          postReactions: post.reactions,
        });
      } else {
        // Caso 2.2: The new reaction is different -> change it
        currentReaction.instance = reaction;

        await post?.save();

        res.status(201).json({
          messege: "reaction updated",
          postReactions: post.reactions,
          newReaction: reaction,
        });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const addLikeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.body.postId;
  const userId = res.locals.userId;

  try {
    const post = await Post.findById(postId, "likes");
    const user = await User.findById(userId, "userName");

    if (!post) {
      const error: CustomError = {
        name: "Post Like Error",
        messages: {
          errors: [
            {
              value: postId,
              msg: "Post not found",
              param: "postId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const currentLike = post.likes.get(userId);
    // Caso 1: There is no like from this user yet
    if (!currentLike) {
      post.likes.set(userId, {
        username: user?.userName!,
      });

      await post.save();

      res.status(201).json({
        messege: "like added",
        postLikes: post.likes,
      });
    } else {
      // Caso 2: There is already a like from this user
      post.likes.delete(userId);
      await post.save();

      return res.status(201).json({
        messege: "like removed from this post",
        postLikes: post.likes,
      });
    }
  } catch (error) {
    next(error);
  }
};
