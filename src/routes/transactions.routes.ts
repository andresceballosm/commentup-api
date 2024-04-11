import express from "express";
import { create, getTransactions } from "../controllers/transaction.controller";
import { existUserByID } from "../helpers/db-validator.helper";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.post("/create", [validateJWT], create);

router.get("/", [validateJWT], getTransactions);

// router.post("/me/update", [validateJWT], updateMe);

module.exports = router;
