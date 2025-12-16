import axios from "axios";
import { PromptParameters, GeneratedPrompt } from "./types";

const client = axios.create({
  baseURL: "https://promptenhancer-fjd3.onrender.com/api",
});

export async function generatePrompt(params: PromptParameters) {
  const res = await client.post<GeneratedPrompt>("/prompt/generate", params);
  return res.data;
}

export async function refinePromptLLM(prompt: GeneratedPrompt) {
  const res = await client.post<GeneratedPrompt>("/prompt/refine", prompt);
  return res.data;
}
