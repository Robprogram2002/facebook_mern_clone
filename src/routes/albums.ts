import { Router } from "express";
import {
  getOneHandler,
  deleteAlbumHandler,
  updateOneHandler,
  createOneHandler,
  removeAlbumItem,
} from "../controllers/albumsController";
import isAuth from "../middleware/is-auth";

const router = Router();

router.post("/create", isAuth, createOneHandler);
router.patch("/update-one", isAuth, updateOneHandler);
router.delete("/delete-one", isAuth, deleteAlbumHandler);
router.delete("/delete-item", isAuth, removeAlbumItem);
router.get("/get-one/:albumId", isAuth, getOneHandler);
export default router;
