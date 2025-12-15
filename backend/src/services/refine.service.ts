import { OpenAI } from "openai";
import { GeneratedPrompt } from "../types/prompt";

const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL =
  process.env.HF_MODEL || "Qwen/Qwen3-4B-Instruct-2507:nscale";

if (!HF_TOKEN) {
  console.warn("WARNING: HF_TOKEN not set. Set it in .env");
}

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: HF_TOKEN,
});

export async function refinePromptWithLLM(
  generated: GeneratedPrompt
): Promise<GeneratedPrompt> {
  const systemText = generated.systemPrompt;
  const userText = generated.userPrompt;

  const userInstruction = `
You are a world-class prompt engineer. Refine and improve the following LLM prompt.

Current system prompt:
---
${systemText}
---

Current user prompt:
---
${userText}
---

Requirements:
- Make the system prompt clearer, more concise, and robust.
- Preserve all important constraints and intent.
- Improve structure with sections and bullet points where helpful.
- Do NOT reference specific API providers (OpenAI, etc.).
- Return ONLY valid JSON with exactly these keys: "systemPrompt" and "userPrompt"
- If the prompt requires code then add coding instructions to the system prompt.

Provide the refined prompt in the following JSON format.

Example JSON:
{
  "systemPrompt": "string",
  "userPrompt": "string"
}

Now output only the JSON, nothing else.
`.trim();

  const chatCompletion = await client.chat.completions.create({
    model: HF_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that outputs strictly valid JSON according to the user's instructions.",
      },
      {
        role: "user",
        content: userInstruction,
      },
    ],
    temperature: 0.2,
    max_tokens: 1000,
  });

  const content =
    chatCompletion.choices?.[0]?.message?.content ?? "";

  const jsonStart = content.indexOf("{");
  const jsonEnd = content.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("LLM did not return valid JSON");
  }

  const jsonStr = content.slice(jsonStart, jsonEnd + 1);
  const parsed = JSON.parse(jsonStr) as GeneratedPrompt;

  return parsed;
}
