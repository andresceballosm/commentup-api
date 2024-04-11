import express from "express";
import { check } from "express-validator";
import {
  profile,
  get,
  getMe,
  updateMe,
  getProfiles,
} from "../controllers/developer.controller";
import { existUserByID } from "../helpers/db-validator.helper";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.get("/", [validateJWT], getMe);

router.post("/profile", [validateJWT], profile);

router.get("/profiles", [validateJWT], getProfiles);

router.post("/me/update", [validateJWT], updateMe);

router.get(
  "/:id",
  [
    validateJWT,
    check("id", "Not is a valid ID").isMongoId(),
    check("id").custom(existUserByID),
  ],
  get,
);

module.exports = router;
