import { Configuration, OpenAIApi } from "openai";
import chalk from 'chalk';
import { generateMessages } from "./utils/promptUtils";
import { generatePrompt } from "./utils/promptUtils";
import { logfile } from "./utils/logUtils.js";
import { get_encoding, encoding_for_model } from "tiktoken";

// OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const tokenizer = encoding_for_model(process.env.MODEL);  // TODO, check token

// configurations
const temperature = process.env.TEMPERATURE ? Number(process.env.TEMPERATURE) : 0.7;  // default is 0.7
const top_p = process.env.TOP_P ? Number(process.env.TOP_P) : 1;                      // default is 1
const max_tokens = process.env.MAX_TOKENS ? Number(process.env.MAX_TOKENS) : 500;

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  const input = req.body.input || "";
  const definations = req.body.definations || "";
  const result_text = req.body.result_text || "";

  try {
    evaluate(input, definations, result_text).then((eval_result) => {
      // Output the result
      res.status(200).json({
        result:{
          text : eval_result,
        },
      });
    });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log("Error:");
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

export async function evaluate(input, definations, result_text) {
  if (!configuration.apiKey) {
    return "error";
  }

  // Create evaluation message
  const eval_message = [];
  const dictionary_message = definations.length == 0 ? 
    "There is completely no information found." : 
    "The search result in JSON is: " + JSON.stringify(definations);
  eval_message.push({
    role: "user", content: 
    "Hi, I'm creating a AI chat application, to enhance the AI response I'm using a dictionary to let AI reference to." + "\n\n" +
    "Now, the user asks: " + input + "\n\n" +
    "After searching the dictionary. " + dictionary_message + "\n\n" +
    "Please notice, the dictionary search may not exactly match input word. And sometimes AI has hallucinations, it may looks correct, but as no exactly match in dictionary the response is completely fake." + "\n\n" +
    "After a while the AI response with: " + result_text + "\n\n" +
    "Now please evaluate the AI response correctness and credibility, 1 is the worst, 10 is the best. If you cannot estimate, evalute as 0. " +
    "Then briefly explain why you estimate this score wihin 1 sentence.\n\n" + 
    "Response with format \"score - explaination\"\n" +
    "Example: 7 - Becasue..."
  })
  console.log("eval_message: " + JSON.stringify(eval_message));

  try {
    let result_text = "";

    if (process.env.END_POINT === "chat_completion") {
      // endpoint: /v1/chat/completions
      const chatCompletion = await openai.createChatCompletion({
        model: process.env.MODEL,
        messages: eval_message,
        temperature: temperature,
        top_p: top_p,
        max_tokens: max_tokens,
      });

      // Get result
      const choices = chatCompletion.data.choices;
      if (!choices || choices.length === 0) {
        result_text = "result error";
      } else {
        result_text = choices[0].message.content;
      }
    }

    if (process.env.END_POINT === "text_completion") {
      return "model unsupported"
    }

    // Output the result
    if (result_text.trim().length === 0) result_text = "null";
    return result_text;
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    console.log("Error:");
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
    return "error";
  }
}