import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import User from "../models/User";
import Post from "../models/Post";
import Album from "../models/Album";
import { send } from "process";

export const getOneHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const albumId = req.params.albumId;

  try {
    const album = await Album.findById(albumId).populate("comments");

    if (!album) {
      return res
        .status(404)
        .json({ messege: "Not album was found with this id", albumId });
    }

    res
      .status(200)
      .json({ messege: "here the fetch album with this id", album: album });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
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
    );

    if (!title || title === "") {
      return res.status(500).json({ messege: "The title field must be fill" });
    }

    if (media !== undefined && media !== "") {
      const post = new Post({
        creator: {
          name: user?.userName,
          perfilImage: user?.profile?.imageProfile,
          _id: user?._id,
        },
        contentImage: media,
        contentText: description,
      });

      await post.save();

      const newAlbum = await Album.create({
        userId: userid,
        title: title,
        items: [post.id],
      });

      await newAlbum.save();
      user?.albums?.push(newAlbum.id);
      await user?.save();

      res.status(201).json({
        messege: "the album and the post has been created",
        album: newAlbum,
        post: post,
      });
    } else {
      const newAlbum = await Album.create({
        userId: userid,
        title: title,
      });

      await newAlbum.save();
      user?.albums?.push(newAlbum.id);
      await user?.save();

      res
        .status(201)
        .json({ messege: "the album has been created", album: newAlbum });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
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
    const album = await Album.findById(albumId);

    if (!album) {
      return res
        .status(404)
        .json({ messege: "Not album was found with this id", albumId });
    }

    const user = await User.findById(
      userId,
      "userName profile.imageProfile posts"
    );
    //@ts-ignore
    album?.title = title;

    if (media !== undefined && media !== "") {
      let post = new Post({
        creator: {
          name: user?.userName,
          perfilImage: user?.profile?.imageProfile,
          _id: user?._id,
        },
        contentImage: media,
        contentText: description,
      });

      await post.save();
      user?.posts?.push(post.id);
      await user?.save();

      album?.items?.push(post.id);

      await album?.save();
      res.status(201).json({
        messege: "The album has been updated and the post has been created",
        album: album,
        post: post,
      });
    }

    await album?.save();
    res
      .status(201)
      .json({ messege: "The album has been updated", album: album });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
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
    const result = await Album.findByIdAndDelete(albumId);

    if (!result) {
      return res
        .status(404)
        .json({ messege: "Not album was found with this id", albumId });
    }

    res
      .status(200)
      .json({ messege: "the album has been deleted", result: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
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
      return res
        .status(404)
        .json({ messege: "Not album was found with this id", albumId });
    }

    const itemIndex = album?.items?.findIndex(
      (item) => item.toString() === itemId.toString()
    );

    if (!itemIndex || itemIndex === -1) {
      //no item con este id, tira un error
    }

    album?.items?.splice(itemIndex!, 1);

    await album?.save();
    res.status(200).json({
      messege: "the item for this album has been removed",
      albumItems: album?.items,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
