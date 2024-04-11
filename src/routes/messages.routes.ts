import express from "express";
import {
  sendWhatsAppMessage,
  whatsAppTwilioWebhook,
} from "../controllers/messages.controller";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.post("/whatsapp/send-message", sendWhatsAppMessage);
router.post("/whatsapp/webhook", whatsAppTwilioWebhook);

module.exports = router;
