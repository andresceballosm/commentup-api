import { Response } from "express";
import axios from "axios";
import { TITLE_ERROR } from "../constants/messages.constants";
import { IPosition, Position } from "../models/position.model";
import { Postulation } from "../models/postulation.model";
import { User } from "../models/user.model";
import { sendMailService } from "../services/mail.service";
import {
  createTechnicalTestService,
  createGeneralQuestionsService,
  calculeGeneralQuestionScoreService,
  calculeTechnicalTestScoreService,
  analizeCVScoreService,
} from "../services/position.service";
import { IDescription } from "../types/types";
import { calculateAvarageScore } from "../utils/calculates.utils";
import { extractPercentage } from "../utils/string.utils";
import { TeamMember } from "../models/team-member.model";

export async function create(req: any, res: Response) {
  try {
    const { id } = req.user;
    let companyID;
    if (req.user.role === "recruiter") {
      const teamMember = await TeamMember.find({ email: req.user.email });
      companyID = teamMember[0].companyID;
    } else {
      companyID = id;
    }

    const {
      description,
      requirements,
      skills,
      language,
      ownQuestions,
      questionsFit,
    } = req.body;
    const textos = requirements.map((obj: IDescription) =>
      obj.children.map((child) => child.text).join(" "),
    );
    const textoString = textos.join(" ");
    const data = req.body;
    let tokens = 0;
    let questions;

    if (!ownQuestions || questionsFit.length === 0) {
      const questionsRequest = await createGeneralQuestionsService(
        textoString,
        language,
      );
      const responseQuestions = questionsRequest.data.choices[0].text
        .trim()
        .toLowerCase();
      questions = responseQuestions.split("\n");
      tokens += questionsRequest.data.usage.total_tokens;
    } else {
      questions = req.body.questionsFit;
    }

    const techinicalTestRequest = await createTechnicalTestService(
      skills,
      language,
    );

    const responseTechinicalTest = techinicalTestRequest.data.choices[0].text.trim();
    const questionsTest = responseTechinicalTest.split("\n\n");
    const allQuestionsTest: any[] = [];
    questionsTest.map((item: any) => {
      const parts = item.split("\n");
      if (parts.length > 3) {
        allQuestionsTest.push({
          question: parts[0],
          options: [parts[1], parts[2], parts[3]],
          answer: parts[4].split("Answer:")[1],
        });
      }
    });

    tokens += techinicalTestRequest.data.usage.total_tokens;

    const emailsTemplate = data.steps.map((step: string) => {
      return {
        step,
        html: "",
        subjet: "",
        slate: [],
      };
    });

    Object.assign(data, {
      userID: id,
      emailsTemplate,
      companyID: companyID,
      description,
      createTokens: tokens,
      tokens,
      questionsTest: allQuestionsTest,
      questions,
      responsibles: [id],
    });
    const position = new Position(data);
    const responsePosition = await position.save();
    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        position: responsePosition,
      },
    });
  } catch (error) {
    console.log("error1 ", error);
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        // @ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}

export async function getPositions(req: any, res: Response) {
  try {
    const { id } = req.user;

    let positions;
    if (req.user.role === "admin") {
      positions = await Position.find({ companyID: id });
    } else {
      positions = await Position.find({ responsibles: { $in: [id] } });
    }

    const activePositions = positions.filter((item: IPosition) => item.active);

    return res.status(200).send({
      ok: true,
      message: null,
      response: activePositions,
    });
  } catch (error) {
    console.log("error2 ", error);
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

export async function getPositionsByStatus(req: any, res: Response) {
  try {
    const { id } = req.user;
    const { status } = req.params;

    let positions;
    if (req.user.role === "admin") {
      positions = await Position.find({ companyID: id });
    } else {
      positions = await Position.find({ responsibles: { $in: [id] } });
    }

    const activePositions = positions.filter(
      (item: IPosition) => item.active && item.status == status,
    );
    return res.status(200).send({
      ok: true,
      message: null,
      response: activePositions,
    });
  } catch (error) {
    console.log("error2 ", error);
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

export async function getPosition(req: any, res: Response) {
  try {
    const { id } = req.params;
    const requestPosition = await Position.findById(id);

    const {
      active,
      title,
      description,
      requirements,
      location,
      status,
      userID,
      companyID,
      github,
      linkedin,
      twitter,
      salary,
      steps,
      type,
      createdAt,
    } = requestPosition;
    const user = await User.findById(userID);
    const company = user.company;
    const position = {
      id: id,
      active,
      title,
      company,
      requirements,
      description,
      location,
      status,
      userID,
      companyID,
      github,
      linkedin,
      twitter,
      salary,
      steps,
      type,
      createdAt,
    };

    return res.status(200).send({
      ok: true,
      message: null,
      response: position,
    });
  } catch (error) {
    console.log("error3 ", error);
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

export async function getPostulations(req: any, res: Response) {
  try {
    const { id } = req.params;

    const position = await Position.findById(id);

    let userRequest;
    if (req.user.role === "recruiter") {
      const teamMember = await TeamMember.find({ email: req.user.email });
      userRequest = teamMember[0].companyID;
    } else {
      userRequest = req.user.id;
    }

    if (position.userID !== userRequest) {
      return res.status(401).send({
        ok: false,
        message: "You dont have permission to read this position",
        response: null,
      });
    }

    const postulations = await Postulation.find({ positionID: id });

    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        position,
        postulations,
      },
    });
  } catch (error) {
    console.log("error4 ", error);
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

export async function getPositionQuestions(req: any, res: Response) {
  try {
    const { id } = req.params;
    const requestPosition = await Position.findById(id);

    const { questions, questionsTest } = requestPosition;

    const position = {
      id,
      questions,
      questionsTest,
    };

    return res.status(200).send({
      ok: true,
      message: null,
      response: position,
    });
  } catch (error) {
    console.log("error5 ", error);
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

export async function createGeneralQuestions(req: any, res: Response) {
  try {
    const { description } = req.body;
    const request = await createGeneralQuestionsService(description, "english");
    const response = request.data.choices[0].text.trim().toLowerCase();
    const questions = response.split("\n");
    return res.status(200).send({
      ok: true,
      message: null,
      response: questions,
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

export async function createTechnicalQuestions(req: any, res: Response) {
  try {
    const { cv, skills } = req.body;
    const techinicalTest = await createTechnicalTestService(skills, "english");
    const response = techinicalTest.data.choices[0].text.trim();
    const questions = response.split("\n\n");
    const allQuestions = questions.map((item: any) => {
      const parts = item.split("\n");
      return {
        question: parts[0],
        options: [parts[1], parts[2], parts[3]],
        answer: parts[4].split("Answer:")[1],
      };
    });

    return res.status(200).send({
      ok: true,
      message: null,
      response: allQuestions,
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

export async function createPostulation(req: any, res: Response) {
  try {
    const { ganeralAnswer, technicalAnswer, cvUrl, positionID } = req.body;

    const requestPosition = await Position.findById(positionID);

    const {
      questions,
      questionsTest,
      requirements,
      language,
    } = requestPosition;

    const description = requirements
      .flatMap((item: any) => item.children.flat())
      .map((item: any) => item.text)
      .join("");

    const answersQuestions = questions.map(
      (question: string, index: number) => {
        return {
          question: question,
          answer: ganeralAnswer[index],
        };
      },
    );

    const scoreTechnical = await calculeTechnicalTestScoreService(
      questionsTest,
      technicalAnswer,
    );

    if (!scoreTechnical.ok) {
      return res.send(scoreTechnical);
    }

    const cvReviewRequest = await analizeCVScoreService(
      cvUrl,
      description,
      language,
    );
    const cvReview = cvReviewRequest.data.choices[0].message.content.trim();
    const scoreCV = extractPercentage(cvReview) || "0";
    const scoreGeneralRequest = await calculeGeneralQuestionScoreService(
      answersQuestions,
      description,
      language,
    );

    let tokens = 0;
    tokens += scoreGeneralRequest?.data?.usage?.total_tokens || 0;

    tokens += cvReviewRequest.data.usage.total_tokens;

    const resultGeneral = scoreGeneralRequest.data.choices[0].message.content.trim();
    console.log("resultGeneral ", resultGeneral);
    const scoreGeneral = extractPercentage(resultGeneral) || "0";
    console.log("scoreGeneral ", scoreGeneral);

    const scoreCVInt =
      typeof scoreCV === "string" && scoreCV !== "IsNaN"
        ? parseFloat(scoreCV)
        : 0;

    const scoreGeneralInt =
      typeof scoreGeneral === "string" && scoreGeneral !== "IsNaN"
        ? parseFloat(scoreGeneral)
        : 0;

    const scoreAverage = calculateAvarageScore(
      scoreCVInt,
      scoreTechnical.response,
      scoreGeneralInt,
    );

    const data = {
      ...req.body,
      scoreTechnical: scoreTechnical.response,
      cv: cvUrl,
      resume: cvReview,
      scoreGeneral: scoreGeneralInt,
      scoreCV: scoreCVInt,
      scoreAverage,
      resultGeneral,
      tokens,
    };

    const requestPostulation = new Postulation(data);
    await requestPostulation.save();

    await Position.findByIdAndUpdate(
      positionID,
      { tokens: requestPosition.tokens + tokens },
      {
        upsert: true,
      },
    );

    return res.status(200).send({
      ok: true,
      message: "Position created successfully!",
      response: "Position created successfully!",
    });
  } catch (error) {
    console.log("error6 ", error);
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

export async function updatePostulationStatus(req: any, res: Response) {
  try {
    const { postulationID, status } = req.body;
    const postulation = await Postulation.findById(postulationID);
    const position = await Position.findById(postulation.positionID);

    let userRequest;
    if (req.user.role === "recruiter") {
      const teamMember = await TeamMember.find({ email: req.user.email });
      userRequest = teamMember[0].companyID;
    } else {
      userRequest = req.user.id;
    }

    if (position.userID !== userRequest) {
      return res.status(401).send({
        ok: false,
        message: "You dont have permission to update this postulation",
        response: null,
      });
    }

    await Postulation.findByIdAndUpdate(
      postulationID,
      { status: status },
      {
        upsert: true,
      },
    );
    const postulations = await Postulation.find({
      positionID: postulation.positionID,
    });

    const emailTemplate = position.emailsTemplate.find(
      (item: any) => item.step === status,
    );

    if (emailTemplate?.subjet && emailTemplate?.html) {
      const htmlSplit = emailTemplate.html.split("{{Candidate&#39;s Name}}");
      const html = htmlSplit[0] + postulation.name + htmlSplit[1];
      const mail = await sendMailService(
        postulation.email,
        emailTemplate.subjet,
        html,
      );
    }

    return res.status(200).send({
      ok: true,
      message: null,
      response: {
        position,
        postulations,
      },
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

export async function removePosition(req: any, res: Response) {
  try {
    const { id } = req.params;
    const position = await Position.findById(id);

    let userRequest;
    if (req.user.role === "recruiter") {
      const teamMember = await TeamMember.find({ email: req.user.email });
      userRequest = teamMember[0].companyID;
    } else {
      userRequest = req.user.id;
    }

    if (position.userID !== userRequest) {
      return res.status(401).send({
        ok: false,
        message: "You dont have permission to update this postulation",
        response: null,
      });
    }

    await Position.findByIdAndUpdate(
      id,
      { active: false },
      {
        upsert: true,
      },
    );

    const positions = await Position.find({ userID: userRequest });
    const activePositions = positions.filter((item: IPosition) => item.active);
    return res.status(200).send({
      ok: true,
      message: null,
      response: activePositions,
    });
  } catch (error) {
    console.log("error7 ", error);
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

export async function updatePositionStatus(req: any, res: Response) {
  try {
    const { id, status } = req.body;
    const position = await Position.findById(id);

    let userRequest;
    if (req.user.role === "recruiter") {
      const teamMember = await TeamMember.find({ email: req.user.email });
      userRequest = teamMember[0].companyID;
    } else {
      userRequest = req.user.id;
    }

    if (position.userID !== userRequest) {
      return res.status(401).send({
        ok: false,
        message: "You dont have permission to update this postulation",
        response: null,
      });
    }

    await Position.findByIdAndUpdate(
      id,
      { status: status },
      {
        upsert: true,
      },
    );

    const positions = await Position.find({ userID: userRequest });
    const activePositions = positions.filter((item: IPosition) => item.active);

    return res.status(200).send({
      ok: true,
      message: null,
      response: activePositions,
    });
  } catch (error) {
    console.log("error8 ", error);
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

export async function updatePositionEmailsTemplate(req: any, res: Response) {
  try {
    const { id, emailsTemplate } = req.body;

    const position = await Position.findById(id);

    let userRequest;
    if (req.user.role === "recruiter") {
      const teamMember = await TeamMember.find({ email: req.user.email });
      userRequest = teamMember[0].companyID;
    } else {
      userRequest = req.user.id;
    }

    if (position.userID !== userRequest) {
      return res.status(401).send({
        ok: false,
        message: "You dont have permission to update this postulation",
        response: null,
      });
    }

    await Position.findByIdAndUpdate(
      id,
      { emailsTemplate },
      {
        upsert: true,
      },
    );

    const positions = await Position.find({ userID: userRequest });
    const activePositions = positions.filter((item: IPosition) => item.active);
    return res.status(200).send({
      ok: true,
      message: null,
      response: activePositions,
    });
  } catch (error) {
    console.log("error9 ", error);
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

export async function shareInLinkedin(req: any, res: Response) {
  try {
    let url_access_token = "https://www.linkedin.com/oauth/v2/accessToken";
    url_access_token += "?client_id=" + process.env.LINKEDIN_CLIENT_ID;
    url_access_token += "&client_secret=" + process.env.LINKEDIN_CLIENT_SECRET;
    url_access_token += "&grant_type=client_credentials";

    const responseOauth = await axios.post(url_access_token);

    console.log("accounts ", responseOauth);
    return res.status(200).send({
      ok: true,
      message: null,
      response: responseOauth,
    });
  } catch (error) {
    console.log("error ", error);
    return res.status(400).send({
      error: true,
      message: {
        title: TITLE_ERROR,
        // @ts-ignore
        message: error.message,
      },
      response: null,
    });
  }
}
