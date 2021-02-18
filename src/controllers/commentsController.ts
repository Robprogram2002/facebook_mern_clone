import { Request, NextFunction, Response } from "express";
// import { validationResult } from "express-validator";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { CustomError } from "./controllerTypes";
import ResponseModel from "../models/Response";

export const createCommentHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const postId = req.body.postId;
  const contentText: string = req.body.contentText;
  const contentImage = req.body.contentImage;

  try {
    if (!contentText && !contentImage) {
      const error: CustomError = {
        name: "Create Comment Error",
        messages: {
          errors: [
            {
              value: "",
              msg: "Comment's content cannot be empty",
              param: "",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const post = await Post.findById(postId, "_id comments");
    const user = await User.findById(userId, "userName profile.imageProfile")!;

    if (!post) {
      const error: CustomError = {
        name: "Create Comment Error",
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

    // create new comment
    const comment = await Comment.create({
      author: {
        userId,
        username: user?.userName!,
        profilePic: user?.profile?.imageProfile!,
      },
      contentText: contentText,
      contentImage: contentImage,
      likes: {},
      reactions: {},
      responses: [],
    });
    await comment.save();

    // save comment's id on post
    post.comments.push(comment.id);
    await post.save();

    res
      .status(201)
      .json({ messege: "The comment has been created", comment: comment });
  } catch (err) {
    next(err);
  }
};

export const createResponseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const commentId = req.body.commentId;
  const contentText = req.body.contentText;
  const contentImage = req.body.contentImage;

  try {
    if (!contentText && !contentImage) {
      const error: CustomError = {
        name: "Create Response Error",
        messages: {
          errors: [
            {
              value: "",
              msg: "Response's content cannot be empty",
              param: "",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const comment = await Comment.findById(commentId, "responses");
    const user = await User.findById(userId, "userName profile.imageProfile")!;

    if (!comment) {
      const error: CustomError = {
        name: "Create Comment Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "Comment not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const response = await ResponseModel.create({
      author: {
        username: user?.userName!,
        userId,
        profilePic: user?.profile?.imageProfile!,
      },
      likes: {},
      contentImage,
      contentText,
    });

    await response.save();

    comment.responses.push(response.id);
    await comment.save();

    return res.status(201).json({
      messege: "Responses created and added to comment",
      commentResponses: comment.responses,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getCommentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.params.postId;

  try {
    const postComments = await Post.findById(postId, "comments").populate(
      "comments"
    );

    if (!postComments) {
      const error: CustomError = {
        name: "Get comments Error",
        messages: {
          errors: [
            {
              value: postId,
              msg: "Post's comments not found",
              param: "postId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res.status(200).json({
      messege: "comments for this post",
      comments: postComments.comments,
    });
  } catch (err) {
    next(err);
  }
};

export const getResponsesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.params.commentId;

  try {
    const commentResponses = await Comment.findById(commentId, "responses")
      .populate("responses", "", "Response")
      .exec();

    if (!commentResponses) {
      const error: CustomError = {
        name: "Get comment's responses Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "Comment's responses not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res.status(200).json({
      messege: "comment's responses",
      commentResponses: commentResponses.responses,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const postId = req.body.postId;
  const commentId = req.body.commentId;

  try {
    const post = await Post.findById(postId, "comments")!;
    const comment = await Comment.findById(commentId, "responses");

    if (!post) {
      const error: CustomError = {
        name: "Delete Comment Error",
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
    } else if (!comment) {
      const error: CustomError = {
        name: "Delete Comment Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "Comment not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    post.comments = post.comments.filter(
      (id) => id.toString() !== commentId.toString()
    );
    await post.save();

    await ResponseModel.deleteMany({ _id: { $in: comment.responses } });
    await Comment.deleteOne({ _id: commentId });

    res.status(201).json({
      messege: "the comment has been deleted",
      postComments: post.comments,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteResponseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.body.commentId;
  const responseId: string = req.body.responseId;

  try {
    const comment = await Comment.findById(commentId, "responses");

    if (!comment) {
      const error: CustomError = {
        name: "Delete comment's response Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "Comment not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const result = await ResponseModel.findByIdAndDelete(responseId);

    if (!result) {
      const error: CustomError = {
        name: "Delete response Error",
        messages: {
          errors: [
            {
              value: responseId,
              msg: "response not found",
              param: "responseId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    comment.responses = comment.responses.filter(
      (id) => id.toString() !== responseId.toString()
    );

    await comment.save();

    res.status(201).json({
      messege: "response deleted and removed from comment",
      commentResponses: comment.responses,
    });
  } catch (err) {
    next(err);
  }
};

export const updateCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.body.commentId;
  const contentText = req.body.contentText;
  const contentImage = req.body.contentImage;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      const error: CustomError = {
        name: "Update comment Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "Comment not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    comment.contentText = contentText;
    comment.contentImage = contentImage;

    // await Comment.updateOne(
    //   { _id: comment?._id },
    //   { $set: { contentImage: contentImage, contentText: contentText } }
    // );
    await comment?.save();
    res
      .status(201)
      .json({ messege: "the commend has been updated", comment: comment });
  } catch (err) {
    next(err);
  }
};

export const updateResponseHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const responseId: string = req.body.responseId;
  const contentText = req.body.contentText;
  const contentImage = req.body.contentImage;

  try {
    const response = await ResponseModel.findById(responseId);

    if (!response) {
      const error: CustomError = {
        name: "Update response Error",
        messages: {
          errors: [
            {
              value: responseId,
              msg: "Response not found",
              param: "responseId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    response.contentImage = contentImage;
    response.contentText = contentText;

    await response.save();

    res.status(201).json({
      messege: "response has been upadted",
      response,
    });
  } catch (err) {
    next(err);
  }
};

export const addCommentLikeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.body.commentId;
  const userId = res.locals.userId;

  try {
    const comment = await Comment.findById(commentId, "likes");
    const user = await User.findById(userId, "userName")!;

    if (!comment) {
      const error: CustomError = {
        name: "Like comment Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "Comment not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }
    // Array method
    // comment?.likes?.push({
    //   userId: userId,
    //   username: user?.userName!,
    // });
    // await comment?.save();
    // res.status(201).json({
    //   messege: "the like has been added to this comment",
    //   commentLikes: comment?.likes,
    // });

    // HashMap Method
    const currentLike = comment.likes.get(userId);
    if (!currentLike) {
      comment.likes.set(userId, {
        username: user?.userName!,
      });

      await comment.save();

      res.status(201).json({
        messege: "like added correctly",
        postLikes: comment.likes,
      });
    } else {
      // Caso 2: There is already a like from this user
      comment.likes.delete(userId);
      await comment.save();

      return res.status(201).json({
        messege: "like removed",
        postLikes: comment.likes,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const addCommentReactionHanlder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const commentId = req.body.commentId;
  const userId = res.locals.userId;
  const reaction: string = req.body.reaction;

  try {
    if (!reaction) {
      const error: CustomError = {
        name: "Comment Reaction Error",
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

    const comment = await Comment.findById(commentId, "reactions");
    const user = await User.findById(userId, "userName");

    if (!comment) {
      const error: CustomError = {
        name: "Comment Reaction Error",
        messages: {
          errors: [
            {
              value: commentId,
              msg: "comment not found",
              param: "commentId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    // HASHTABLE / HASHMAP SEARCH AND UPDATE METHOD
    const currentReaction = comment.reactions.get(userId);

    // Caso 1: There is no reaction from this user yet
    if (!currentReaction) {
      comment.reactions.set(userId, {
        username: user?.userName!,
        instance: reaction,
      });

      await comment.save();

      res.status(201).json({
        messege: "raection added successfuly",
        postReactions: comment.reactions,
        reactionType: reaction,
      });
    } else {
      // Caso 2: There is already a reaction from this user

      // Caso 2.1: The new reaction is the same -> delete it
      if (currentReaction.instance === reaction) {
        comment.reactions.delete(userId);
        await comment.save();

        return res.status(201).json({
          messege: "reaction removed from this post",
          postReactions: comment.reactions,
        });
      } else {
        // Caso 2.2: The new reaction is different -> change it
        currentReaction.instance = reaction;

        await comment.save();

        res.status(201).json({
          messege: "reaction updated",
          postReactions: comment.reactions,
          newReaction: reaction,
        });
      }
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const addResponseLikeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const responseId = req.body.responseId;
  const userId = res.locals.userId;

  try {
    const response = await ResponseModel.findById(responseId);

    if (!response) {
      const error: CustomError = {
        name: "Update response Error",
        messages: {
          errors: [
            {
              value: responseId,
              msg: "Response not found",
              param: "responseId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const user = await User.findById(userId, "userName")!;

    const currentLike = response.likes.get(userId);

    if (!currentLike) {
      // create one
      response.likes.set(userId, { username: user?.userName! });

      await response.save();

      return res.status(201).json({
        messege: "Like added to response",
        responseLikes: response.likes,
      });
    } else {
      // delete it
      response.likes.delete(userId);

      await response.save();

      return res.status(201).json({
        messege: "like removed from response",
        responseLikes: response.likes,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
