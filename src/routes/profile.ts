import { Router } from "express";
import {
  basicInfoHandler,
  educationInfoHandler,
  generalInfoHandler,
  lifeEventsIfonHanlder,
  palcesInfoHandler,
  portadaImageHanlder,
  profileImageHandler,
  getALbumsHanlder,
  getUserInfo,
  getFollowsHandler,
  getFollowersHandler,
  addFollowHandler,
  makeFriendHandler,
  refuseRequestHandler,
  markRequestSawHanlder,
} from "../controllers/profileController";
import isAuth from "../middleware/is-auth";
const router = Router();

router.patch("/perfil-image", isAuth, profileImageHandler);
router.patch("/portada-image", isAuth, portadaImageHanlder);
router.patch("/general-info", isAuth, generalInfoHandler);
router.patch("/education-info", isAuth, educationInfoHandler);
router.patch("/basic-info", isAuth, basicInfoHandler);
router.patch("/life-events-info", isAuth, lifeEventsIfonHanlder);
router.patch("/places-info", isAuth, palcesInfoHandler);

router.get("/albums/:userId", isAuth, getALbumsHanlder);
router.get("/get-info/:userId", isAuth, getUserInfo);

router.post("/add-follow", isAuth, addFollowHandler);
router.post("/make-friend/:requestId", isAuth, makeFriendHandler);
router.post("/refuse-friend/:requestId", isAuth, refuseRequestHandler);
router.post("/mark-requests", isAuth, markRequestSawHanlder);
router.get("/follows/:userId", isAuth, getFollowsHandler);
router.get("/followers/:userId", isAuth, getFollowersHandler);

export default router;
