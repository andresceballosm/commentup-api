import express from "express";
import {
  addToken,
  authenticationTiktok,
  oAuthTiktok,
} from "../controllers/tiktok.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";
const router = express.Router();

//routes
router.get("/authentication", [validateJWT], authenticationTiktok);
router.get("/oauth", oAuthTiktok);
router.post("/add-token", [validateJWT], addToken);

module.exports = router;
