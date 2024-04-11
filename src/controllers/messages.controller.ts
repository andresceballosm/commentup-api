import { Response } from "express";
import axios from "axios";
import { TITLE_ERROR } from "../constants/messages.constants";
import { sendSmsWhatsAppService } from "../services/twilio-whatsapp.service";
const MessagingResponse = require("twilio").twiml.MessagingResponse;

export async function sendWhatsAppMessage(req: any, res: Response) {
  try {
    const { postulationID, to, message } = req.body;
    const messageToEveryOne = `🎉Felicidades el contrato ha sido firmado por todas las partes, para nosotros es un placer darle la bienvenida a Finmobi, y esperamos ser un gran aliado para usted de ahora en adelante.`;
    const from = "+15073387751";
    const smsOwner = await sendSmsWhatsAppService(
      to,
      from,
      messageToEveryOne,
      true,
    );

    // const postulation = await Postulation.findById(postulationID);
    // const position = await Position.findById(postulation.positionID);
    // if (position.userID !== req.user.id) {
    //   return res.status(401).send({
    //     ok: false,
    //     message: "You dont have permission to update this postulation",
    //     response: null,
    //   });
    // }

    // await Postulation.findByIdAndUpdate(
    //   postulationID,
    //   { status: status },
    //   {
    //     upsert: true,
    //   },
    // );
    // const postulations = await Postulation.find({
    //   positionID: postulation.positionID,
    // });

    // const emailTemplate = position.emailsTemplate.find(
    //   (item: any) => item.step === status,
    // );

    // if (emailTemplate?.subjet && emailTemplate?.html) {
    //   const htmlSplit = emailTemplate.html.split("{{Candidate&#39;s Name}}");
    //   const html = htmlSplit[0] + postulation.name + htmlSplit[1];
    //   const mail = await sendMailService(
    //     postulation.email,
    //     emailTemplate.subjet,
    //     html,
    //   );
    // }

    return res.status(200).send({
      ok: true,
      message: null,
      response: null,
    });
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}

export async function whatsAppTwilioWebhook(req: any, res: Response) {
  try {
    console.log("RECIVIED MESSAGE ", req.body);
    const message = req.body.Body;
    const from = req.body.From;
    console.log("Incoming message:", message, "from:", from);
    // Save the incoming message to MongoDB if required

    return res.status(200).send({
      ok: true,
      message: null,
      response: null,
    });
  } catch (error) {
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: error,
      },
      response: null,
    });
  }
}
