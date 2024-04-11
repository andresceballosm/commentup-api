import { Response, NextFunction } from "express";
import * as hubspot from "@hubspot/api-client";
import { ICard, IUser, User } from "../models/user.model";
import { TITLE_ERROR } from "../constants/messages.constants";
import { RemoveAccountService } from "../services/user.service";
import { auth } from "../config/firebase.config";
import { DeletePostsService } from "../services/instagram.service";
import Customer from "../models/customer.model";
import CreditCard from "../models/credit-card.model";
import { TeamMember } from "../models/team-member.model";
import { sendMailService } from "../services/mail.service";
import AddTeamMemberEmailTemplate from "../templates/add-team-member";
import WelcomeTemplate from "../templates/welcome";
import InviteCompleteProfileTemplate from "../templates/invite-complete-profile";
import { Developer, IDeveloper } from "../models/developer.model";

export async function create(req: any, res: Response) {
  try {
    console.log("req.body ", req.body);
    const exist = await User.findOne({ email: req.body.email });
    Object.assign(req.body, {
      active: true,
    });
    const { firebaseUid, role } = req.body;
    await auth.setCustomUserClaims(firebaseUid, { role });

    const hubspotClient = new hubspot.Client({
      accessToken: process.env.HUBSPOT_SECRET_KEY,
    });

    const words = req.body.displayName.split(" ");
    const firstname = words.length > 2 ? words[0] + " " + words[1] : words[0];
    const lastname = words.length > 2 ? words[2] : words[1];

    const contactObj = {
      properties: {
        firstname,
        lastname,
        email: req.body.email,
        country: req.body.country,
        phone: req.body.phone,
        jobtitle: req.body.role,
      },
    };
    const companyObj = {
      properties: {
        name: req.body.company,
      },
    };

    const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(
      contactObj,
    );

    const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(
      companyObj,
    );

    await hubspotClient.crm.companies.associationsApi.create(
      // @ts-ignore
      createCompanyResponse?.id,
      "contacts",
      createContactResponse?.id,
      [
        {
          associationCategory: "HUBSPOT_DEFINED",
          associationTypeId: hubspot.AssociationTypes.companyToContact,
        },
      ],
    );

    let user = new User(req.body);
    if (!exist) {
      await user.save();
      const { email, displayName } = req.body;
      const html = WelcomeTemplate(displayName);
      await sendMailService(email, `Welcome to CommentUp`, html);
    } else {
      user = await User.findByIdAndUpdate(exist.id, req.body, {
        upsert: true,
      });
    }

    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        user: user,
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

export async function sendEmailToInviteTo(req: any, res: Response) {
  try {
    const users = await User.find();
    const developers = await Developer.find();

    for (const user of users) {
      const userData = user.transform();
      const existProfile = developers.find(
        (developer: IDeveloper) => developer.userID === userData.id,
      );
      if (!existProfile) {
        const { displayName, email } = userData;
        const html = InviteCompleteProfileTemplate(displayName);
        await sendMailService(
          email,
          `Complete your profile in CommentUp`,
          html,
        );
      }
    }

    return res.status(200).send({
      ok: true,
      response: "Emails sent",
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

export async function createTeamMember(req: any, res: Response) {
  try {
    const { id } = req.user;
    const { email } = req.body;
    console.log("req.body ", req.body);
    if (!email) {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "Missing email",
        },
        response: null,
      });
    }

    const company = await User.findById(id);
    const exist = await User.findOne({ email: req.body.email });
    if (exist) {
      return res.status(400).send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "Sorry, the user already registered!",
        },
        response: null,
      });
    }

    const data = {
      ...req.body,
      companyID: id,
    };

    const teamMember = new TeamMember(data);
    const response = await teamMember.save();
    await User.findByIdAndUpdate(
      id,
      { $push: { teamMembers: response._id } },
      {
        upsert: true,
      },
    );
    console.log("response ", response);
    const urlAccept = `${process.env.COMMENTUP_URL}team-members/accept/${response._id}`;
    const html = AddTeamMemberEmailTemplate(
      company.company,
      req.body.email,
      urlAccept,
      "https://commentup.app/",
    );

    const mail = await sendMailService(
      req.body.email,
      `You have been invited to join a ${company.company} team`,
      html,
    );

    const team = await TeamMember.find({ companyID: id });

    return res.status(200).send({
      ok: true,
      message: null,
      response: team,
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

export async function getTeamMembers(req: any, res: Response) {
  try {
    const { id } = req.user;
    const team = await TeamMember.find({ companyID: id });
    return res.status(200).send({
      ok: true,
      response: team,
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: {
        title: TITLE_ERROR,
        // @ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}

export async function getTeamMember(req: any, res: Response) {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);
    return res.status(200).send({
      ok: true,
      response: member,
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: {
        title: TITLE_ERROR,
        // @ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}

export async function acceptTeamMemberInvitation(req: any, res: Response) {
  try {
    const { email, firebaseUid, displayName, teamMemberID } = req.body;
    const member = await TeamMember.findById(teamMemberID);
    const dataUser = {
      email,
      firebaseUid,
      displayName,
      role: member.role,
    };
    const user = new User(dataUser);
    const userSaved = await user.save();
    console.log("userSaved ", userSaved);

    await TeamMember.findByIdAndUpdate(
      teamMemberID,
      {
        displayName,
        status: "accepted",
        userID: userSaved._id,
      },
      {
        upsert: true,
      },
    );

    const html = WelcomeTemplate(displayName);
    await sendMailService(email, `Welcome to CommentUp`, html);
    return res.status(200).send({
      ok: true,
      response: "Registered succesfully!",
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: {
        title: TITLE_ERROR,
        // @ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}

export async function selectDefaultCreditCard(req: any, res: Response) {
  try {
    const { cards, id } = req.user;
    const { cardID, customer } = req.body;

    const newCards = cards.map((card: ICard) => {
      if (card.cardID === cardID) {
        card.selected = true;
      } else {
        card.selected = false;
      }
      return card;
    });
    const card = new CreditCard(cardID, customer);
    console.log("card ", card);
    //@ts-ignore
    const defaultCard = await card.selectCreditCard();
    console.log("defaultCard ", defaultCard);
    if (!defaultCard.ok) {
      return res.json({
        ok: true,
        message: {
          message: "error-select-default-card",
        },
      });
    }

    const r = await User.findByIdAndUpdate(
      id,
      { cards: newCards },
      {
        upsert: true,
      },
    );
    const user = await User.findById(id);
    return res.json({
      ok: true,
      response: user,
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "error-general",
      },
      //@ts-ignore
      response: error,
    });
  }
}

export async function addCreditCard(req: any, res: Response) {
  try {
    let customerCommentUp;
    const { stripetoken } = req.body;
    const { id, phone, displayName, email } = req.user;
    const cards = req.user?.cards || [];

    if (cards?.length === 0) {
      const customer = new Customer(displayName, email, phone);
      const cus = await customer.createCustomer();
      if (!cus.ok) {
        return res.json({
          ok: false,
          response: cus.response,
        });
      }
      customerCommentUp = cus.response;
    } else {
      customerCommentUp = cards[0].customer;
    }
    const card = new CreditCard(stripetoken, customerCommentUp);
    const card_response = await card.saveCreditCard();
    if (!card_response.ok) {
      return res.json({
        ok: false,
        message: {
          title: TITLE_ERROR,
          message: "error-add-card",
        },
        response: card_response.response,
      });
    }

    const cardToSave = {
      name: card_response.response.name,
      customer: customerCommentUp,
      cardID: card_response.response.id,
      brand: card_response.response.brand,
      last4: card_response.response.last4,
      selected: cards.length === 0,
    };

    cards.push(cardToSave);
    const r = await User.findByIdAndUpdate(
      id,
      { cards },
      {
        upsert: true,
      },
    );
    const user = await User.findById(id);

    return res.status(200).json({
      ok: true,
      response: {
        user,
        message: {
          message: "app-msg-credit-card-created",
        },
      },
    });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: {
        title: TITLE_ERROR,
        message: "add-cc-error",
      },
      response: error,
    });
  }
}

export async function getMe(req: any, res: Response, next: NextFunction) {
  try {
    if (new Date() > new Date(req.user.trialPeriod) && req.user.pricing === 0) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          pricing: 0.00008,
        },
        {
          upsert: true,
        },
      );
      req.user.pricing = 0.00008;
    }
    return res.status(200).send({
      ok: true,
      response: {
        user: req?.user,
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

export async function unLinkSocialAccount(req: any, res: Response) {
  try {
    const newUser = await RemoveAccountService(req.user.id, req.params.account);
    return res.json(newUser);
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

export async function editSummary(req: any, res: Response, next: NextFunction) {
  try {
    return res.status(200).send({
      error: false,
      message: null,
      response: {
        user: "",
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

export async function deleteAccount(req: any, res: Response) {
  try {
    const request = await auth.deleteUser(req.user.firebaseUid);
    const posts = await DeletePostsService(req.user.firebaseUid);
    console.log("posts ", posts);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        active: false,
      },
      {
        upsert: true,
      },
    );

    return res.json({
      ok: true,
      response: {
        user,
      },
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

export async function deleteCreditCard(req: any, res: Response) {
  try {
    const { cardID, customer } = req.body;
    const card = new CreditCard(cardID, customer);
    const removeCard = await card.deleteCreditCard();

    if (!removeCard.ok) {
      return res.send({
        error: true,
        message: {
          title: TITLE_ERROR,
          message: "error-general",
        },
        //@ts-ignore
        response: removeCard.response,
      });
    }

    const reqUser = await User.updateOne(
      { _id: req.user.id },
      { $pull: { cards: { cardID: cardID } } },
    );

    const user = await User.findById(req.user.id);
    console.log("user ", user);
    return res.json({
      ok: true,
      response: {
        user,
      },
      message: {
        message: "deleted-cc-succesfully",
      },
    });
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        message: "error-general",
      },
      //@ts-ignore
      response: error.message,
    });
  }
}
