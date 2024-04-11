import express from "express";
import {
  create,
  updateInteraction,
  updateInteractionAvailability,
} from "../controllers/interaction.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.post("/create", [validateJWT], create);
router.post("/update", updateInteraction);
router.post("/interaction-availability", updateInteractionAvailability);

module.exports = router;
