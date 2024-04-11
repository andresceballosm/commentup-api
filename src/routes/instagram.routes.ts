import express from "express";
import {
  analyzeComments,
  connectInstagramAccount,
  getAccounts,
  getComments,
  getCommentsAleatory,
  getCommentsById,
  getMedia,
  getPostAnalyzed,
  getRepliesByCommentId,
  getStories,
  getUserData,
  removeComment,
  replyComment,
} from "../controllers/instagram.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

//router.get("/accounts", [validateJWT], getAccounts);
router.get("/accounts", getAccounts);
router.get("/connect/:token", [validateJWT], connectInstagramAccount);
router.post("/media", [validateJWT], getMedia);
router.post("/stories", [validateJWT], getStories);
router.post("/comments", [validateJWT], getCommentsById);
router.get("/comments/:id", [validateJWT], getComments);
router.post("/comments/analyze", [validateJWT], analyzeComments);
router.get("/posts/:id", [validateJWT], getPostAnalyzed);
router.post("/comments/reply", [validateJWT], replyComment);
router.get("/user/:id", [validateJWT], getUserData);
router.delete("/comment/:id", [validateJWT], removeComment);
router.get("/comments/replies/:id", [validateJWT], getRepliesByCommentId);
router.post("/comments/aleatory", [validateJWT], getCommentsAleatory);

module.exports = router;
