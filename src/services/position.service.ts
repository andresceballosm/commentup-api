import { IQuestionTest } from "../types/types";
import { extractTextFromPDF } from "../utils/pdf.utils";

const { Configuration, OpenAIApi } = require("openai");

export async function createGeneralQuestionsService(
  description: any[],
  language: string,
) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const text = `Generate 5 questions in ${language} for know if the candidate has match with the follow position : "${description}"`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 250,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response;
  } catch (error) {
    //@ts-ignore
    return {
      ok: false,
      response: false,
      error: error,
    };
  }
}

export async function createTechnicalTestService(
  skills: string[],
  language: string,
) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const text = `Create 5 techinical questions in ${language} with 3 answer option to evaluate a candidate with these skills, please give the correct answer with the name "answer": "${skills.join(
      ", ",
    )}".\nTexto: ${skills}`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response;
  } catch (error) {
    //@ts-ignore
    console.log("error ", error);
    return {
      ok: false,
      response: false,
      error: error,
    };
  }
}

export async function calculeTechnicalTestScoreService(
  questionsTest: IQuestionTest[],
  technicalAnswer: string[],
) {
  try {
    let correct = 0;
    questionsTest.map((question: IQuestionTest, index: number) => {
      if (question.answer.trim() == technicalAnswer[index].trim()) {
        correct += 1;
      }
    });
    return {
      ok: true,
      response: (correct / questionsTest.length) * 100,
    };
  } catch (error) {
    //@ts-ignore
    return {
      ok: false,
      response: 0,
      error,
    };
  }
}

export async function calculeGeneralQuestionScoreService(
  quenstions: any[],
  description: string,
  language: string,
) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const qaStrings = quenstions.map(
      ({ question, answer }: any) => `${question} Answer: ${answer}`,
    );

    const qaString = qaStrings.join("\n");
    const openai = new OpenAIApi(configuration);
    const text = `Calculate in % the match of this candidate and create a description in ${language} about the match: ${qaString} with this job offer: ${description}`;
    // const response = await openai.createCompletion({
    //   model: "gpt-3.5-turbo",
    //   prompt: text,
    //   temperature: 0,
    //   max_tokens: 500,
    //   top_p: 1.0,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    // });
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
    });
    return response;
  } catch (error) {
    //@ts-ignore
    console.log("error ", error);
    return {
      ok: false,
      response: false,
      error: error,
    };
  }
}

export async function analizeCVScoreService(
  cvUrl: string,
  description: string,
  language: string,
) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const cvString = await extractTextFromPDF(cvUrl);

    const openai = new OpenAIApi(configuration);
    const text = `Give in percentage number the match of this candidate with the CV and create a description in ${language} about the match: ${cvString} with this job offer: ${description}`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
    });
    return response;
  } catch (error) {
    //@ts-ignore
    console.log("error ", error);
    return {
      ok: false,
      response: false,
      error: error,
    };
  }
}
