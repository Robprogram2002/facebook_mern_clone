import { Router } from "express";
import {
  createPostCommentHanlder,
  createResponseHandler,
  deleteCommentHandler,
  getCommentsHandler,
  getResponsesHandler,
  updateCommentHandler,
  updateResponseHanlder,
  deleteResponseHandler,
  addCommentLikeHandler,
  addResponseLikeHandler,
  addCommentReactionHanlder,
} from "../controllers/commentsController";
import isAuth from "../middleware/is-auth";

const router = Router();

router.post("/create", isAuth, createPostCommentHanlder);
router.post("/add-response", isAuth, createResponseHandler);
router.get("/:postId", isAuth, getCommentsHandler);
router.get("/responses/:commentId", isAuth, getResponsesHandler);
router.patch("/update-one", isAuth, updateCommentHandler);
router.patch("/update-response", isAuth, updateResponseHanlder);
router.delete("/delete-one", isAuth, deleteCommentHandler);
router.delete("/delete-response", isAuth, deleteResponseHandler);

router.post("/comment-like", isAuth, addCommentLikeHandler);
router.post("/comment-reaction", isAuth, addCommentReactionHanlder);
router.post("/response-like", isAuth, addResponseLikeHandler);

export default router;
