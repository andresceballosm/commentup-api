import express from "express";
import { check } from "express-validator";
//import controllers
import {
  analyzeComments,
  answerCOmments,
} from "../controllers/comments.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.post("/analyze", analyzeComments);
router.post("/chatbot", answerCOmments);

module.exports = router;
