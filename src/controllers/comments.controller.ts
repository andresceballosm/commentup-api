import { Response } from "express";
import { TITLE_ERROR } from "../constants/messages.constants";
import {
  AnalizeCommentService,
  AnalyzeCommentPrice,
  CommentClassificationService,
} from "../services/comments.service";

export async function answerCOmments(req: any, res: Response) {
  try {
    const { comment } = req.body;
    const options = ['price', 'more information', 'where buy', 'how buy'];
    const analyze = await AnalizeCommentService(comment, options);
    if (analyze.status !== 200) {
      return res.send({
        ok: false,
        response: {
          msg: "Error",
          code: "app-missing-fields",
        },
      });
    }
    console.log("analyze ", analyze?.data);
    const response = analyze.data.choices[0].text.trim().toLowerCase();
    console.log('response ', response)
    const isPricing = response === "yes" || response === "yes";
    console.log("isPricing ", isPricing);
    return res.send(isPricing);
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

export async function analyzeComments(req: any, res: Response) {
  try {
    const { comment } = req.body;
    const analyze = await CommentClassificationService(comment);
    if (analyze.status !== 200) {
      return res.send({
        ok: false,
        response: {
          msg: "Error",
          code: "app-missing-fields",
        },
      });
    }

    const sentiment = analyze.data.choices[0].text;
    return res.send({
      ok: true,
      response: {
        msg: sentiment,
        code: "successfully",
      },
    });
  } catch (error) {
    console.log("error", error);
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
