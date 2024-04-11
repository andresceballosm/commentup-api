import { Response, Request, NextFunction } from "express";
import { auth } from "../config/firebase.config";
import { User } from "../models/user.model";

export const validateJWT = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      auth
        .verifyIdToken(authHeader)
        .then(async function(decodedToken: any) {
          req.id = decodedToken.uid;
          const user = await User.findOne({ firebaseUid: decodedToken.uid });
          req.user = user;
          return next();
        })
        .catch(function(error: any) {
          console.log(error);
          return res.sendStatus(403);
        });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    
  }
};
