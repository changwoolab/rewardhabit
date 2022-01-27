import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "../secret_modules/constants";

// OPEN AI API
const configuration = new Configuration({
    organization: "org-zELMZkEUcwBirh4VxEQCshAf",
    apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const askOpenAi = async (question: string) => {
    const response = await openai.createCompletion("text-davinci-001", {
        prompt: `Q: ${question}\nA:`,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
    });
    console.log(response.data);
}
