import express from "express";
import { create, get, paymentBill } from "../controllers/bill.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";
const router = express.Router();

//routes
router.post("/create", [validateJWT], create);
router.post("/payment", [validateJWT], paymentBill);
router.get("/", [validateJWT], get);

module.exports = router;
