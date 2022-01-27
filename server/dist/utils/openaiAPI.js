"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askOpenAi = void 0;
const openai_1 = require("openai");
const constants_1 = require("../secret_modules/constants");
const configuration = new openai_1.Configuration({
    organization: "org-zELMZkEUcwBirh4VxEQCshAf",
    apiKey: constants_1.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const askOpenAi = async (question) => {
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
};
exports.askOpenAi = askOpenAi;
//# sourceMappingURL=openaiAPI.js.map