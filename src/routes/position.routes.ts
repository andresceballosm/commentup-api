import express from "express";
import { check } from "express-validator";
//import controllers
import {
  create,
  createGeneralQuestions,
  createPostulation,
  createTechnicalQuestions,
  getPosition,
  getPositionQuestions,
  getPositions,
  getPostulations,
  removePosition,
  shareInLinkedin,
  updatePositionEmailsTemplate,
  updatePositionStatus,
  updatePostulationStatus,
  getPositionsByStatus,
} from "../controllers/position.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.post("/", [validateJWT], create);
router.get("/share/share-linkedin", shareInLinkedin);
router.get("/", [validateJWT], getPositions);
router.get("/status/:status", [validateJWT], getPositionsByStatus);
router.get("/remove/:id", [validateJWT], removePosition);
router.post("/update-emails", [validateJWT], updatePositionEmailsTemplate);
router.post("/update-status", [validateJWT], updatePositionStatus);
router.get("/:id", getPosition);
router.get("/results/:id", [validateJWT], getPostulations);
router.get("/postulations/:id", [validateJWT], getPostulations);
router.get("/questions/:id", getPositionQuestions);
router.post("/general-question", createGeneralQuestions);
router.post("/technical-question", createTechnicalQuestions);
router.post("/create-postulation", createPostulation);
router.post(
  "/postulation/update-status",
  [validateJWT],
  updatePostulationStatus,
);

router.get("/postulations/last/:number", [validateJWT], getPostulations);
router.get("/postulations/date/:date", [validateJWT], getPostulations);
//Get postulations with score greater than
router.get("/postulations/score/:number", [validateJWT], getPostulations);

module.exports = router;
