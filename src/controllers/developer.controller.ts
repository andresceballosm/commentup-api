import { Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { TITLE_ERROR } from "../constants/messages.constants";
import { Developer } from "../models/developer.model";
import { getRate } from "../utils/calculates.utils";
import { IInteraction, Interaction } from "../models/interaction.model";

export async function profile(req: any, res: Response) {
  try {
    const values = {
      ...req.body,
      userID: req.user.id,
      rate: getRate(req.body.experience),
    };

    let developer = new Developer(values);
    const exist = await User.findById(req.user.id);

    if (!exist) {
      await developer.save();
    } else {
      developer = await Developer.findByIdAndUpdate(exist.id, values, {
        upsert: true,
      });
    }
    const developerData = await Developer.findOne({ userID: req.user.id });
    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        profile: developerData,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: false,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function getProfiles(req: any, res: Response) {
  try {
    const id = req.user._id;
    const developers = await Developer.find({});
    let users = [];

    for (const dev of developers) {
      const user = await User.findById(dev.userID);
      const interactions = await Interaction.find({
        developerID: dev.userID,
        clientID: id,
      });
      const interactionInProcess = interactions.find(
        (interaction: IInteraction) =>
          interaction.status == "developer-accepted" ||
          interaction.status === "in-interview" ||
          interaction.status === "pending",
      );
      const devTransformed = dev.transform();
      const developerData = {
        ...devTransformed,
        rate: devTransformed.rate + 8,
        displayName: user.displayName,
        email: user.email,
        country: user.country,
        photo: user.photo,
        interaction: interactionInProcess
          ? interactionInProcess.status.charAt(0).toUpperCase() +
            interactionInProcess.status.slice(1)
          : "Contact",
      };
      users.push(developerData);
    }
    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        developers: users,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: false,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function getMe(req: any, res: Response, next: NextFunction) {
  try {
    const developer = await Developer.findOne({ userID: req.user.id });
    return res.status(200).send({
      ok: true,
      response: {
        profile: developer,
        minVersion: "1.1",
        showPayments: false,
      },
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function updateMe(req: any, res: Response, next: NextFunction) {
  try {
    const { email, password, ...rest } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, rest, {
      upsert: true,
    });
    if (user) {
      const userTransformed = user.transform();
      const newUser = {
        ...userTransformed,
        ...rest,
      };
      return res.status(200).send({
        error: false,
        message: null,
        response: {
          user: newUser,
        },
      });
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        //@ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}

export async function get(req: any, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).send({
      error: false,
      message: null,
      response: {
        user,
      },
    });
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        //@ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}
