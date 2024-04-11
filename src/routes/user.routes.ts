import express from "express";
import { check } from "express-validator";
import {
  acceptTeamMemberInvitation,
  addCreditCard,
  create,
  createTeamMember,
  deleteAccount,
  deleteCreditCard,
  get,
  getMe,
  getTeamMember,
  getTeamMembers,
  selectDefaultCreditCard,
  sendEmailToInviteTo,
  unLinkSocialAccount,
  updateMe,
} from "../controllers/user.controller";
import { existUserByID } from "../helpers/db-validator.helper";
import { validateJWT } from "../middlewares/validate-jwt.middlewares";

const router = express.Router();

router.get("/", [validateJWT], getMe);

router.post("/create", create);

router.post("/add-credit-card", [validateJWT], addCreditCard);

router.post("/me/update", [validateJWT], updateMe);

router.get("/me/unlink/:account", [validateJWT], unLinkSocialAccount);

router.get(
  "/:id",
  [
    validateJWT,
    check("id", "Not is a valid ID").isMongoId(),
    check("id").custom(existUserByID),
  ],
  get,
);

router.delete("/me", [validateJWT], deleteAccount);
router.post("/card/delete", [validateJWT], deleteCreditCard);
router.post(`/card/default`, [validateJWT], selectDefaultCreditCard);
router.post(`/team-member/create`, [validateJWT], createTeamMember);
router.get(`/team-member/team`, [validateJWT], getTeamMembers);
router.get(`/team-member/:id`, getTeamMember);
router.post(`/team-member/accept`, acceptTeamMemberInvitation);
// router.get("/emails/send-email-invite-to-create-profile", sendEmailToInviteTo);

module.exports = router;
