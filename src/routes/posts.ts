import { Router } from "express";
import { body } from "express-validator";
import {
  createHandler,
  getSingleHanlder,
  getAllHanlder,
  getByUserHandler,
  deleteHandler,
  addReactionHanlder,
  addLikeHandler,
} from "../controllers/postsController";
import isAuth from "../middleware/is-auth";

const router = Router();

router.post("/create", isAuth, createHandler);
router.get("/all", isAuth, getAllHanlder);

router.get("/get-by-user/:userId", isAuth, getByUserHandler);
router.delete("/delete-one/:postId", isAuth, deleteHandler);
router.get("/get-one/:postId", isAuth, getSingleHanlder);

router.post("/add-reaction", isAuth, addReactionHanlder);
router.post("/add-like", isAuth, addLikeHandler);

export default router;
