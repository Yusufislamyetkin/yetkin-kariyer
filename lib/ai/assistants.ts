import OpenAI from "openai";

import { AI_ASSISTANT_ID, AI_USER_AGENT } from "./config";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "User-Agent": AI_USER_AGENT,
  },
});

export const ASSISTANT_ID = AI_ASSISTANT_ID;

export const ensureAssistantClient = () => {
  if (!ASSISTANT_ID) {
    throw new Error("Assistant kimliği tanımlı değil");
  }
  return client;
};


