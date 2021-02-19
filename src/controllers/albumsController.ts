import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post";
import Album from "../models/Album";
import { CustomError } from "./controllerTypes";
import { Types } from "mongoose";

export const getOneHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const albumId = req.params.albumId;

  try {
    // const album = await Album.findById(albumId)
    //   .populate("comments")
    //   .populate("items")
    //   .lean()
    //   .exec();

    const album = await Album.aggregate([
      { $match: { _id: Types.ObjectId(albumId) } },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "items",
          foreignField: "_id",
          as: "items",
        },
      },
    ]).exec();

    if (!album) {
      const error: CustomError = {
        name: "Get album error",
        messages: {
          errors: [
            {
              value: albumId,
              msg: "Album not found",
              param: "albumId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res.status(200).json({ messege: "fetch album", album: album });
  } catch (err) {
    next(err);
  }
};

export const createOneHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userid = res.locals.userId;
  const title = req.body.title;
  const media = req.body.mediaUrl;
  const description = req.body.description;

  try {
    const user = await User.findById(
      userid,
      "userName profile.imageProfile albums"
    )!;
    const { profile } = user!;

    if (!title || title === "") {
      const error: CustomError = {
        name: "Create album error",
        messages: {
          errors: [
            {
              value: title,
              msg: "The title field must be fill",
              param: "title",
            },
          ],
        },
        status: 400,
      };
      throw error;
    } else if (!media || media === "") {
      const error: CustomError = {
        name: "Create album error",
        messages: {
          errors: [
            {
              value: media,
              msg: "The media field must be fill",
              param: "media",
            },
          ],
        },
        status: 400,
      };
      throw error;
    }

    // if () {
    const post = new Post({
      creator: {
        name: user?.userName,
        profilePic: profile.imageProfile,
        _id: user?._id,
      },
      contentImage: media,
      contentText: description,
      type: "newAlbum",
    });

    const newAlbum = new Album({
      creator: {
        _id: userid,
        name: user?.userName,
        profilePic: profile.imageProfile,
      },
      title: title,
      items: [post.id],
      cover: media,
      description,
    });

    post.gallery = {
      title: title,
      id: newAlbum._id,
      coverImage: media,
    };

    user?.albums?.push(newAlbum._id);
    user?.posts.push(post._id);
    newAlbum.items?.push(post._id);

    await Promise.all([post.save(), newAlbum.save(), user?.save()]);

    res.status(201).json({
      messege: "the album and the post has been created",
      album: newAlbum,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOneHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  const albumId = req.body.albumId;
  const title = req.body.title;
  const media = req.body.mediaUrl;
  const description = req.body.description;

  try {
    if (
      (!title || title === "") &&
      (!description || description === "") &&
      (!media || media === "")
    ) {
      const error: CustomError = {
        name: "Update album error",
        messages: {
          errors: [
            {
              value: "",
              msg: "Must be a data to update the album",
              param: "title, description, media",
            },
          ],
        },
        status: 400,
      };
      throw error;
    }

    const album = await Album.findById(albumId);

    if (!album) {
      const error: CustomError = {
        name: "Update album error",
        messages: {
          errors: [
            {
              value: albumId,
              msg: "Album not found",
              param: "albumId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    const user = await User.findById(
      userId,
      "userName profile.imageProfile posts"
    );

    if (description !== undefined && description !== "") {
      album.description = description;
    } else if (title !== undefined && title !== "") {
      album.title = title;
    }

    await album.save();

    if (media !== undefined && media !== "") {
      const post = new Post({
        creator: {
          name: user?.userName!,
          profilePic: user!.profile!.imageProfile!,
          _id: user?._id,
        },
        contentImage: media,
        contentText: description ? description : null,
        type: "album",
        gallery: {
          title: album.title,
          id: album._id,
          coverImage: media,
        },
      });

      user?.posts?.push(post._id);
      album?.items?.push(post.id);

      await Promise.all([post.save(), user?.save(), album.save()]);

      res.status(201).json({
        messege: "album updated and new post created",
        album: album,
        post: post,
      });
    }

    res.status(201).json({ messege: "album has been updated", album: album });
  } catch (err) {
    next(err);
  }
};

export const deleteAlbumHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const albumId = req.body.albumId;

  try {
    const album = await Album.findById(albumId, async (err, doc) => {
      await doc?.remove();
    });

    if (!album) {
      const error: CustomError = {
        name: "Delete album error",
        messages: {
          errors: [
            {
              value: albumId,
              msg: "Album not found",
              param: "albumId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    res
      .status(200)
      .json({ messege: "the album has been deleted", result: album });
  } catch (err) {
    next(err);
  }
};

export const removeAlbumItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const albumId = req.body.albumId;
  const itemId = req.body.itemId;

  try {
    const album = await Album.findById(albumId, "items");

    if (!album) {
      const error: CustomError = {
        name: "Delete album item error",
        messages: {
          errors: [
            {
              value: albumId,
              msg: "Album not found",
              param: "albumId",
            },
          ],
        },
        status: 404,
      };
      throw error;
    }

    album.items = album.items?.filter(
      (id) => id.toString() !== itemId.toString()
    )!;

    await album?.save();

    res.status(200).json({
      messege: "album item has been removed",
      albumItems: album?.items,
    });
  } catch (err) {
    next(err);
  }
};
