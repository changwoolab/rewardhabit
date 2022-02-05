import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../secret_modules/constants";

// OPEN AI API
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/** OPENAI API를 활용하여 질문 */
export const askOpenAi = async (question: string) => {
  const response = await openai.createCompletion("text-davinci-001", {
    prompt: `\n\nQ: ${question}\nA:`,
    temperature: 0,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ["\n"],
  });
  if (!response.data.choices) return null;
  return response.data.choices[0].text;
};
