import { Response, NextFunction } from "express";
import { User } from "../models/user.model";
import { TITLE_ERROR } from "../constants/messages.constants";
import { IInteraction, Interaction } from "../models/interaction.model";
import { getRate } from "../utils/calculates.utils";
import { sendMailService } from "../services/mail.service";
import InteractionDeveloperTemplate from "../templates/interaction-developer";
import InteractionClientTemplate from "../templates/interaction-client";
import { Developer } from "../models/developer.model";
import InteractionAvailabilityTemplate from "../templates/interaction-availability";
import InteractionRejectedTemplate from "../templates/interaction-rejected";
import InteractionScheduleDeveloperTemplate from "../templates/interaction-schedule-developer";

export async function create(req: any, res: Response) {
  try {
    const values = {
      ...req.body,
      clientID: req.user.id,
    };
    const {
      developerID,
      developerEmail,
      developerName,
      description,
    } = req.body;
    const interactionExist = await Interaction.find({
      developerID: developerID,
      clientID: req.user.id,
    });
    if (interactionExist.length > 0) {
      const interactionInProcess = interactionExist.find(
        (interaction: IInteraction) =>
          interaction.status == "developer-accepted" ||
          interaction.status === "in-interview" ||
          interaction.status === "pending",
      );

      if (interactionInProcess) {
        return res.send({
          ok: false,
          message: null,
          response:
            "Apologies, but there is already an ongoing process with this developer.",
        });
      }
    }
    const interaction = new Interaction(values);
    const request = await interaction.save();

    const interactionsRequest = await Interaction.findOne({
      clientID: req.user.id,
    });

    const interactionData = interactionsRequest.transform();

    const html = InteractionDeveloperTemplate(
      developerName,
      description,
      interactionData.id,
    );
    await sendMailService(developerEmail, `New opportunity in CommentUp`, html);

    const htmlClient = InteractionClientTemplate(
      req.user.displayName,
      developerName,
    );

    await sendMailService(
      req.user.email,
      `New intereaction created`,
      htmlClient,
    );

    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        interactions: interactionData,
      },
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function updateInteraction(req: any, res: Response) {
  try {
    const { id, ...rest } = req.body;
    const request = await Interaction.findById(id);
    const interaction = request.transform();

    await Interaction.findByIdAndUpdate(id, rest, {
      upsert: true,
    });

    const clientRequest = await User.findById(interaction.clientID);
    const client = clientRequest.transform();

    const developerRequest = await Developer.findById(interaction.developerID);
    const developer = developerRequest.transform();
    const userDeveloperRequest = await User.findById(developer.userID);
    const userDeveloper = userDeveloperRequest.transform();

    const { status } = req.body;
    const photo =
      userDeveloper.photo ||
      `https://avatars.dicebear.com/api/avataaars/${userDeveloper.displayName.replace(
        /[^a-z0-9]+/i,
        "-",
      )}.svg`;

    if (status === "developer-accepted" && interaction.status === "pending") {
      const html = InteractionAvailabilityTemplate(
        client.displayName,
        userDeveloper.displayName,
        photo,
        developer.title,
        developer.experience,
        userDeveloper.country,
        id,
      );
      await sendMailService(client.email, `New match in CommentUp`, html);
    } else if (
      status === "developer-declined" &&
      interaction.status === "pending"
    ) {
      const html = InteractionRejectedTemplate(
        client.displayName,
        userDeveloper.displayName,
        photo,
        developer.title,
        developer.experience,
        userDeveloper.country,
      );

      await sendMailService(
        client.email,
        `Answer to your request in CommentUp`,
        html,
      );
    }

    return res.status(200).send({
      error: false,
      message: null,
      response: "Saved successfully!",
    });
  } catch (error) {
    console.log("error ", error);
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

export async function updateInteractionAvailability(req: any, res: Response) {
  try {
    const { id, ...rest } = req.body;
    const request = await Interaction.findById(id);
    const interaction = request.transform();

    await Interaction.findByIdAndUpdate(id, rest, {
      upsert: true,
    });

    const clientRequest = await User.findById(interaction.clientID);
    const client = clientRequest.transform();

    const developerRequest = await Developer.findById(interaction.developerID);
    const developer = developerRequest.transform();
    const userDeveloperRequest = await User.findById(developer.userID);
    const userDeveloper = userDeveloperRequest.transform();

    const photo =
      client.photo ||
      `https://avatars.dicebear.com/api/avataaars/${client.displayName.replace(
        /[^a-z0-9]+/i,
        "-",
      )}.svg`;

    const html = InteractionScheduleDeveloperTemplate(
      userDeveloper.displayName,
      client.displayName,
      photo,
      req.body.availability,
      client.country,
    );

    await sendMailService(
      userDeveloper.email,
      `Schedule interview - CommentUp`,
      html,
    );

    return res.status(200).send({
      error: false,
      message: null,
      response: "Saved successfully!",
    });
  } catch (error) {
    console.log("error ", error);
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
