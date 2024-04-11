import axios from "axios";
const natural = require("natural");

const { Configuration, OpenAIApi } = require("openai");

const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/engines/chatgpt-3.5/completions";

export const CommentClassificationService = async (comment: string) => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const text =
      "Classify the sentiment in these tweets:\n\n1." +
      comment +
      "\n\nTweet sentiment ratings:";

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response;
  } catch (error) {
    console.log("error ", error);
  }
};

export async function AnalizeCommentService(
  comment: string,
  options: string[],
) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const text = `Answer only the value of the option, identify if the following sentence is asking for some of these options: "${options.join(
      ", ",
    )}".\nTexto: ${comment}`;
    //const text = `Answer yes or no, Identify if the following sentence is asking for the price: "${comment}"`;

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
    console.log("error ", error);
    return {
      ok: false,
      response: false,
      error: error,
    };
  }
}

export async function AnalyzeCommentPrice(comment: string) {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    // Realizamos una solicitud de completado de texto a la API de OpenAI
    const completions = await openai.createCompletion({
      model: "text-corie-001",
      prompt: comment,
      maxTokens: 60,
      n: 1,
      stop: "\n",
    });

    // Analizamos la respuesta de la API en busca de preguntas sobre el precio
    const text = completions.choices[0].text.toLowerCase();

    // Utilizamos la biblioteca natural para realizar análisis gramaticales
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text);

    // Determinamos si la pregunta contiene una referencia al precio
    const tagger = new natural.BrillPOSTagger(
      natural.data.verbLexicon,
      natural.data.nounLexicon,
      natural.defaultCategoryMap,
    );
    const taggedWords = tagger.tag(words);
    const nounTags = ["NN", "NNS", "NNP", "NNPS"];
    for (const [word, tag] of taggedWords) {
      if (nounTags.includes(tag) && word === "precio") {
        return {
          ok: true,
          response: true,
          error: null,
        };
      }
    }
    return {
      ok: true,
      response: false,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      response: false,
      error: error,
    };
  }
}
